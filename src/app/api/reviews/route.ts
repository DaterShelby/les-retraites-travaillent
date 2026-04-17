import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, rating, comment } = body;

    // Validation
    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json(
        { error: "L'ID de la réservation est requis." },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5." },
        { status: 400 }
      );
    }

    if (typeof comment !== "string" || comment.length < 20) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir au moins 20 caractères." },
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
        { error: "Vous devez être connecté pour laisser un avis." },
        { status: 401 }
      );
    }

    // Get booking to verify it exists and is completed
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, client_id, provider_id, status")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "La réservation n'existe pas." },
        { status: 404 }
      );
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Seules les réservations terminées peuvent être évaluées." },
        { status: 400 }
      );
    }

    // Check if user is a participant of the booking
    if (user.id !== booking.client_id && user.id !== booking.provider_id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à laisser un avis sur cette réservation." },
        { status: 403 }
      );
    }

    // Determine reviewer and reviewee
    // The reviewer is the person leaving the review
    // The reviewee is the other person in the booking
    const reviewerId = user.id;
    const revieweeId = user.id === booking.client_id ? booking.provider_id : booking.client_id;

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("reviewer_id", reviewerId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis sur cette réservation." },
        { status: 400 }
      );
    }

    // Create review
    const { data: newReview, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          booking_id: bookingId,
          reviewer_id: reviewerId,
          reviewee_id: revieweeId,
          rating,
          comment,
        },
      ])
      .select()
      .single();

    if (reviewError) {
      console.error("Supabase review error:", reviewError);
      return NextResponse.json(
        { error: "Une erreur est survenue lors de la création de l'avis." },
        { status: 500 }
      );
    }

    // Notify reviewee
    try {
      await createNotification(
        revieweeId,
        "new_review",
        `Nouvel avis ${rating}/5`,
        comment.trim().slice(0, 140),
        { booking_id: bookingId, rating }
      );
    } catch (notifyError) {
      console.error("[reviews] notification error:", notifyError);
    }

    return NextResponse.json(newReview, { status: 201 });
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

    // Get reviews where user is reviewer or reviewee
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        bookings:booking_id (
          id,
          service_id,
          client_id,
          provider_id,
          status
        ),
        reviewer:reviewer_id (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        reviewee:reviewee_id (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        services:bookings(service_id) (
          id,
          title
        )
      `
      )
      .or(`reviewer_id.eq.${user.id},reviewee_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Supabase error:", reviewsError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des avis." },
        { status: 500 }
      );
    }

    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
