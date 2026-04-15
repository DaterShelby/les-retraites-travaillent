"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export async function createServiceAction(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Vous devez être connecté" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string | null;
  const priceType = formData.get("priceType") as string;
  const priceAmount = formData.get("priceAmount") as string;
  const city = formData.get("city") as string;

  try {
    const validatedData = serviceSchema.parse({
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      priceType,
      priceAmount: priceAmount ? parseFloat(priceAmount) : undefined,
      city,
    });

    const { data: service, error } = await supabase.from("services").insert({
      provider_id: user.id,
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      subcategory: validatedData.subcategory || null,
      price_type: validatedData.priceType,
      price_amount: validatedData.priceAmount || null,
      city: validatedData.city,
      status: "draft",
      photos: [],
      tags: [],
    });

    if (error) {
      return { error: "Erreur lors de la création du service" };
    }

    redirect(`/dashboard/services/${user.id}`);
  } catch (err: any) {
    return {
      error:
        err.errors?.[0]?.message ||
        "Erreur lors de la validation des données",
    };
  }
}
