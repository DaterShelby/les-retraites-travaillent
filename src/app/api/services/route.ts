import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ServiceInsert } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      price_type,
      price_amount,
      city,
      tags,
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Le titre est requis." },
        { status: 400 }
      );
    }

    if (title.trim().length < 5) {
      return NextResponse.json(
        { error: "Le titre doit contenir au moins 5 caractères." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "La description est requise." },
        { status: 400 }
      );
    }

    if (description.trim().length < 10) {
      return NextResponse.json(
        { error: "La description doit contenir au moins 10 caractères." },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "La catégorie est requise." },
        { status: 400 }
      );
    }

    if (!price_type || typeof price_type !== "string") {
      return NextResponse.json(
        { error: "Le type de tarification est requis." },
        { status: 400 }
      );
    }

    const validPriceTypes = ["hourly", "fixed", "negotiable"];
    if (!validPriceTypes.includes(price_type)) {
      return NextResponse.json(
        { error: "Le type de tarification est invalide." },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour créer une annonce." },
        { status: 401 }
      );
    }

    // Build service object
    const serviceData: ServiceInsert = {
      provider_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      price_type: price_type as "hourly" | "fixed" | "negotiable",
      status: "published",
      city: city || null,
      tags: Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === "string") : [],
    };

    if (price_amount && !isNaN(Number(price_amount))) {
      serviceData.price_amount = Number(price_amount);
    }

    // Insert into database
    const { data, error } = await supabase
      .from("services")
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue lors de la création de l'annonce. Veuillez réessayer." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
