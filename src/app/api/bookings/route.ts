import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BookingInsert, BookingRow, ServiceRow } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

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

    // Get the service to find provider_id + pricing
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("provider_id, price_amount, price_type")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: "Le service n'existe pas." },
        { status: 404 }
      );
    }

    const svc = service as ServiceRow & {
      price_amount?: number | null;
      price_type?: string | null;
    };

    // Compute total: hourly × duration hours; fixed prices keep raw amount.
    let amountTotal: number | null = null;
    if (typeof svc.price_amount === "number") {
      const hours =
        Math.max(0.25, (endDate.getTime() - startDate.getTime()) / 3_600_000);
      const total =
        svc.price_type === "fixed"
          ? svc.price_amount
          : svc.price_amount * hours;
      amountTotal = Math.round(total * 100);
    }

    // Create booking
    const bookingData: BookingInsert & {
      amount_total?: number | null;
      currency?: string;
      payment_status?: string;
    } = {
      service_id: serviceId,
      client_id: user.id,
      provider_id: svc.provider_id,
      slot_start: slotStart,
      slot_end: slotEnd,
      status: "pending",
      description: description || null,
      amount_total: amountTotal,
      currency: "eur",
      payment_status: "unpaid",
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

    // Notify provider of new booking request (best-effort, don't fail booking if it errors)
    try {
      const { data: clientProfile } = await supabase
        .from("user_profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();
      const clientName =
        [clientProfile?.first_name, clientProfile?.last_name]
          .filter(Boolean)
          .join(" ") || "Un client";
      await createNotification(
        svc.provider_id,
        "new_booking",
        "Nouvelle demande de réservation",
        `${clientName} souhaite réserver votre service.`,
        { booking_id: (newBooking as BookingRow).id, service_id: serviceId }
      );
    } catch (notifyError) {
      console.error("[bookings] notification error:", notifyError);
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
