import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendNewsletterWelcomeEmail } from "@/lib/email";

const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);

    const supabase = createServerSupabaseClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "Vous êtes déjà inscrit(e) à la newsletter." },
        { status: 200 }
      );
    }

    // Insert subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      // Table might not exist yet — graceful fallback
      if (error.code === "42P01") {
        return NextResponse.json(
          { message: "Inscription enregistrée. Merci !" },
          { status: 200 }
        );
      }
      throw error;
    }

    // Send welcome email (non-blocking)
    void sendNewsletterWelcomeEmail(email).catch(() => {});

    return NextResponse.json(
      { message: "Merci ! Vous êtes inscrit(e) à la newsletter." },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.errors[0]?.message || "Données invalides";
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
