import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, content } = body;

    // Validation
    if (!conversationId || typeof conversationId !== "string") {
      return NextResponse.json(
        { error: "L'ID de la conversation est requis." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Le contenu du message est requis." },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le message ne peut pas être vide." },
        { status: 400 }
      );
    }

    if (content.trim().length > 5000) {
      return NextResponse.json(
        { error: "Le message est trop long (max 5000 caractères)." },
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
        { error: "Vous devez être connecté pour envoyer un message." },
        { status: 401 }
      );
    }

    // Verify user is a participant of the conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id, participant_ids")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "La conversation n'existe pas." },
        { status: 404 }
      );
    }

    if (
      !Array.isArray(conversation.participant_ids) ||
      !conversation.participant_ids.includes(user.id)
    ) {
      return NextResponse.json(
        { error: "Vous n'êtes pas un participant de cette conversation." },
        { status: 403 }
      );
    }

    // Insert message
    const { data: newMessage, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (msgError) {
      console.error("Supabase error:", msgError);
      return NextResponse.json(
        { error: "Une erreur est survenue lors de l'envoi du message." },
        { status: 500 }
      );
    }

    // Update conversation's last_message_at
    const { error: updateError } = await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) {
      console.error("Update error:", updateError);
      // Don't fail the request if we can't update the timestamp
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
