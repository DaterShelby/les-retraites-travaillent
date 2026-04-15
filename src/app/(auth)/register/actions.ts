"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !role) {
    return { error: "Tous les champs sont requis" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: data.user.id,
      role: role as "retiree" | "client" | "company",
      first_name: "",
      onboarding_completed: false,
    });

    if (profileError) {
      return { error: "Erreur lors de la création du profil" };
    }
  }

  redirect("/onboarding/step-1");
}
