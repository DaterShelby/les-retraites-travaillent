"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function forgotPasswordAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "L'adresse email est requise" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  return { success: "Un email de réinitialisation vous a été envoyé." };
}
