import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId } = body;

    // Validation
    if (!participantId || typeof participantId !== "string") {
      return NextResponse.json(
        { error: "L'ID du participant est requis." },
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
        { error: "Vous devez être connecté pour créer une conversation." },
        { status: 401 }
      );
    }

    // Prevent self-conversation
    if (user.id === participantId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas créer une conversation avec vous-même." },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these two users
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_ids.cs.{${user.id},${participantId}},participant_ids.cs.{${participantId},${user.id}})`
      )
      .limit(1)
      .single();

    if (existingConversation) {
      return NextResponse.json(existingConversation, { status: 200 });
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        participant_ids: [user.id, participantId],
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue lors de la création de la conversation." },
        { status: 500 }
      );
    }

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
