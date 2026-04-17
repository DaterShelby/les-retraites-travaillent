import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (errorParam) {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set("error", errorDescription ?? errorParam);
    return NextResponse.redirect(url);
  }

  if (!code) {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set("error", "Lien invalide ou expiré.");
    return NextResponse.redirect(url);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set(
      "error",
      error?.message ?? "Impossible de finaliser la connexion."
    );
    return NextResponse.redirect(url);
  }

  // Determine destination: if profile is incomplete, send to onboarding
  const userId = data.session.user.id;
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  let destination = next;
  if (!profile) {
    destination = "/onboarding/step-1";
  } else if (!profile.onboarding_completed) {
    destination = profile.role ? "/onboarding/step-2" : "/onboarding/step-1";
  }

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
