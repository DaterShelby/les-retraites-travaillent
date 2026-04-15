"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.errors[0]?.message ?? "Données invalides" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: "Email ou mot de passe incorrect" };
  }

  redirect("/dashboard");
}
