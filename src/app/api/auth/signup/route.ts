import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, role } = body;

    // Basic validation
    if (!email || !password || !firstName || !role) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    if (!["retiree", "client", "company"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide." },
        { status: 400 }
      );
    }

    // Create user with admin API — email auto-confirmed
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name: firstName },
      });

    if (createError) {
      if (createError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "Un compte existe déjà avec cet email. Essayez de vous connecter." },
          { status: 409 }
        );
      }
      if (createError.message.includes("rate")) {
        return NextResponse.json(
          { error: "Trop de tentatives. Veuillez patienter quelques minutes." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    if (!userData?.user) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte." },
        { status: 500 }
      );
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: userData.user.id,
        first_name: firstName.trim(),
        role,
      });

    if (profileError) {
      // User created but profile failed — not critical, can be fixed on login
      console.error("Profile creation error:", profileError);
    }

    return NextResponse.json(
      {
        success: true,
        userId: userData.user.id,
        message: "Compte créé avec succès !",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
