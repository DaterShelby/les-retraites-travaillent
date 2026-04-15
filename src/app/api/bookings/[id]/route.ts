import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get authenticated user
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // Get booking with full details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(
        `
        *,
        services:service_id (
          id,
          title,
          category,
          description,
          price_amount,
          price_type,
          provider_id
        ),
        client:client_id (
          id,
          first_name,
          last_name,
          avatar_url,
          city,
          phone
        ),
        provider:provider_id (
          id,
          first_name,
          last_name,
          avatar_url,
          city,
          phone
        )
      `
      )
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "La réservation n'existe pas." },
        { status: 404 }
      );
    }

    // Check if user is involved in this booking
    if (booking.client_id !== user.id && booking.provider_id !== user.id) {
      return NextResponse.json(
        { error: "Accès refusé." },
        { status: 403 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, cancellation_reason } = body;

    // Validation
    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { error: "Le statut est requis." },
        { status: 400 }
      );
    }

    const validStatuses: BookingStatus[] = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "disputed",
    ];
    if (!validStatuses.includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: "Le statut est invalide." },
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
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // Get current booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "La réservation n'existe pas." },
        { status: 404 }
      );
    }

    // Check permissions
    if (status === "confirmed") {
      // Only provider can confirm
      if (booking.provider_id !== user.id) {
        return NextResponse.json(
          { error: "Seul le prestataire peut confirmer la réservation." },
          { status: 403 }
        );
      }
    } else if (status === "completed") {
      // Only provider can mark as completed
      if (booking.provider_id !== user.id) {
        return NextResponse.json(
          { error: "Seul le prestataire peut marquer comme terminée." },
          { status: 403 }
        );
      }
    } else if (status === "cancelled") {
      // Both client and provider can cancel
      if (booking.client_id !== user.id && booking.provider_id !== user.id) {
        return NextResponse.json(
          { error: "Accès refusé." },
          { status: 403 }
        );
      }
    } else {
      // For other transitions, check if user is involved
      if (booking.client_id !== user.id && booking.provider_id !== user.id) {
        return NextResponse.json(
          { error: "Accès refusé." },
          { status: 403 }
        );
      }
    }

    // Update booking
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "cancelled") {
      updateData.cancellation_reason = cancellation_reason || null;
      updateData.cancelled_by = user.id;
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de la réservation." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
