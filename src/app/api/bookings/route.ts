import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BookingInsert, BookingRow, ServiceRow } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, slotStart, slotEnd, description } = body;

    // Validation
    if (!serviceId || typeof serviceId !== "string") {
      return NextResponse.json(
        { error: "L'ID du service est requis." },
        { status: 400 }
      );
    }

    if (!slotStart || typeof slotStart !== "string") {
      return NextResponse.json(
        { error: "La date de début est requise." },
        { status: 400 }
      );
    }

    if (!slotEnd || typeof slotEnd !== "string") {
      return NextResponse.json(
        { error: "La date de fin est requise." },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(slotStart);
    const endDate = new Date(slotEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Les dates sont invalides." },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "La date de fin doit être après la date de début." },
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
        { error: "Vous devez être connecté pour créer une réservation." },
        { status: 401 }
      );
    }

    // Get the service to find provider_id
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("provider_id")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: "Le service n'existe pas." },
        { status: 404 }
      );
    }

    // Create booking
    const bookingData: BookingInsert = {
      service_id: serviceId,
      client_id: user.id,
      provider_id: (service as ServiceRow).provider_id,
      slot_start: slotStart,
      slot_end: slotEnd,
      status: "pending",
      description: description || null,
    };

    const { data: newBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error("Supabase booking error:", bookingError);
      return NextResponse.json(
        {
          error:
            "Une erreur est survenue lors de la création de la réservation. Veuillez réessayer.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get bookings where user is client OR provider
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        `
        *,
        services:service_id (
          id,
          title,
          category,
          provider_id
        ),
        client:client_id (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        provider:provider_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `
      )
      .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("slot_start", { ascending: false });

    if (bookingsError) {
      console.error("Supabase error:", bookingsError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des réservations." },
        { status: 500 }
      );
    }

    return NextResponse.json(bookings || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
