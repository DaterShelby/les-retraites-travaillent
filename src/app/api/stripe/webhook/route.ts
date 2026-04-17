import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, assertStripeConfigured } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
// Stripe needs the raw body to verify the signature.
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "service-role-unset",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    assertStripeConfigured();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe non configuré." },
      { status: 503 }
    );
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET manquant." },
      { status: 503 }
    );
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    return NextResponse.json(
      {
        error: `Signature invalide : ${
          err instanceof Error ? err.message : "unknown"
        }`,
      },
      { status: 400 }
    );
  }

  // Idempotency: insert event row first, ignore duplicates
  const { error: dupError } = await supabaseAdmin
    .from("payment_events")
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });

  if (dupError && dupError.code === "23505") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error("[stripe-webhook] handler error", event.type, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur interne." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      const clientId = session.metadata?.client_id;
      const providerId = session.metadata?.provider_id;
      if (!bookingId) return;
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", bookingId);
      await supabaseAdmin
        .from("payment_events")
        .update({ booking_id: bookingId })
        .eq("stripe_event_id", event.id);

      // Notify both parties (idempotent enough — same event won't replay thanks to payment_events)
      const inserts: Array<Record<string, unknown>> = [];
      if (clientId) {
        inserts.push({
          user_id: clientId,
          type: "booking_confirmed",
          title: "Paiement confirmé",
          body: "Votre réservation est confirmée. Vous pouvez désormais échanger avec le prestataire.",
          data: { booking_id: bookingId },
          read_at: null,
          created_at: new Date().toISOString(),
        });
      }
      if (providerId) {
        inserts.push({
          user_id: providerId,
          type: "booking_confirmed",
          title: "Réservation payée",
          body: "Le client vient de payer. La mission est confirmée.",
          data: { booking_id: bookingId },
          read_at: null,
          created_at: new Date().toISOString(),
        });
      }
      if (inserts.length > 0) {
        await supabaseAdmin.from("notifications").insert(inserts);
      }
      return;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingId = intent.metadata?.booking_id;
      if (!bookingId) return;
      await supabaseAdmin
        .from("bookings")
        .update({ payment_status: "failed" })
        .eq("id", bookingId);
      return;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const intentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (!intentId) return;
      await supabaseAdmin
        .from("bookings")
        .update({ payment_status: "refunded", status: "cancelled" })
        .eq("stripe_payment_intent_id", intentId);
      return;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      const userId = account.metadata?.user_id;
      const status = account.charges_enabled
        ? "active"
        : account.requirements?.disabled_reason
        ? "restricted"
        : "pending";
      const update: Record<string, unknown> = {
        stripe_account_status: status,
        stripe_charges_enabled: !!account.charges_enabled,
        stripe_payouts_enabled: !!account.payouts_enabled,
      };
      if (userId) {
        await supabaseAdmin.from("user_profiles").update(update).eq("id", userId);
      } else if (account.id) {
        await supabaseAdmin
          .from("user_profiles")
          .update(update)
          .eq("stripe_account_id", account.id);
      }
      return;
    }

    default:
      // Log only — no action needed
      return;
  }
}
