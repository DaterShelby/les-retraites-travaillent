import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe, assertStripeConfigured } from "@/lib/stripe/client";

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
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role, stripe_account_id, first_name, last_name, company_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  if (profile.role !== "retiree" && profile.role !== "company") {
    return NextResponse.json(
      { error: "Seuls les prestataires peuvent encaisser des paiements." },
      { status: 403 }
    );
  }

  let accountId = profile.stripe_account_id as string | null;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email: user.email ?? undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: profile.role === "company" ? "company" : "individual",
      business_profile: {
        name: profile.company_name ?? profile.first_name ?? undefined,
        product_description: "Services Les Retraités Travaillent",
      },
      metadata: { user_id: user.id, role: profile.role },
    });

    accountId = account.id;
    await supabase
      .from("user_profiles")
      .update({
        stripe_account_id: accountId,
        stripe_account_status: "pending",
      })
      .eq("id", user.id);
  }

  const origin = new URL(request.url).origin;
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/dashboard/earnings?stripe=refresh`,
    return_url: `${origin}/dashboard/earnings?stripe=return`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}
