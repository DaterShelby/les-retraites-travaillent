import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  stripe,
  assertStripeConfigured,
  platformFee,
} from "@/lib/stripe/client";

const schema = z.object({
  bookingId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    assertStripeConfigured();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe non configuré." },
      { status: 503 }
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = schema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Données invalides." },
        { status: 422 }
      );
    }
    throw err;
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `
        id, client_id, provider_id, amount_total, currency, payment_status,
        service:services!bookings_service_id_fkey ( id, title ),
        provider:user_profiles!bookings_provider_id_fkey (
          id, stripe_account_id, stripe_charges_enabled
        )
      `
    )
    .eq("id", parsed.bookingId)
    .maybeSingle();

  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const b = booking as {
    id: string;
    client_id: string;
    provider_id: string;
    amount_total: number | null;
    currency: string;
    payment_status: string;
    service: { id: string; title: string } | { id: string; title: string }[];
    provider: {
      id: string;
      stripe_account_id: string | null;
      stripe_charges_enabled: boolean;
    } | Array<{
      id: string;
      stripe_account_id: string | null;
      stripe_charges_enabled: boolean;
    }>;
  };

  if (b.client_id !== user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à payer cette réservation." },
      { status: 403 }
    );
  }

  if (b.payment_status === "paid" || b.payment_status === "released") {
    return NextResponse.json(
      { error: "Cette réservation est déjà payée." },
      { status: 409 }
    );
  }

  if (!b.amount_total || b.amount_total < 100) {
    return NextResponse.json(
      { error: "Montant invalide pour cette réservation." },
      { status: 400 }
    );
  }

  const service = Array.isArray(b.service) ? b.service[0] : b.service;
  const provider = Array.isArray(b.provider) ? b.provider[0] : b.provider;

  if (!provider?.stripe_account_id || !provider.stripe_charges_enabled) {
    return NextResponse.json(
      {
        error:
          "Le prestataire n'a pas finalisé son compte de paiement. Contactez-le pour qu'il complète son onboarding Stripe.",
      },
      { status: 409 }
    );
  }

  const fee = platformFee(b.amount_total);
  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: b.currency,
          unit_amount: b.amount_total,
          product_data: {
            name: service?.title ?? "Réservation",
            description: `Réservation Les Retraités Travaillent · #${b.id.slice(0, 8)}`,
          },
        },
      },
    ],
    payment_intent_data: {
      application_fee_amount: fee,
      transfer_data: { destination: provider.stripe_account_id },
      metadata: {
        booking_id: b.id,
        client_id: b.client_id,
        provider_id: b.provider_id,
      },
    },
    metadata: {
      booking_id: b.id,
    },
    customer_email: user.email ?? undefined,
    success_url: `${origin}/dashboard/bookings/${b.id}?paid=1`,
    cancel_url: `${origin}/dashboard/bookings/${b.id}?cancelled=1`,
  });

  await supabase
    .from("bookings")
    .update({
      stripe_checkout_session_id: session.id,
      payment_status: "pending",
    })
    .eq("id", b.id);

  return NextResponse.json({ url: session.url, id: session.id });
}
