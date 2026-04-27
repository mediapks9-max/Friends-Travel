"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TripType, TripReason } from "@/lib/supabase/types";

export type CreateTripState = {
  error?: string;
};

export async function createTrip(
  _prev: CreateTripState,
  formData: FormData,
): Promise<CreateTripState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "צריך להיות מחובר" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const trip_type = formData.get("trip_type") as TripType;
  const reasons = formData.getAll("reasons") as TripReason[];
  const starts_at = formData.get("starts_at") as string;
  const location_text =
    (formData.get("location_text") as string)?.trim() || null;
  const max_participants = parseInt(
    formData.get("max_participants") as string,
    10,
  );

  // Validation
  if (!title || title.length < 3) return { error: "כותרת חייבת לפחות 3 תווים" };
  if (!["travel", "local", "activity"].includes(trip_type))
    return { error: "סוג תוכנית לא תקין" };
  if (!starts_at) return { error: "חייב לבחור מתי" };
  if (new Date(starts_at) < new Date())
    return { error: "התאריך חייב להיות בעתיד" };
  if (!max_participants || max_participants < 1 || max_participants > 20)
    return { error: "מספר משתתפים לא תקין" };

  const { data, error } = await supabase
    .from("trips")
    .insert({
      owner_id: user.id,
      title,
      description,
      trip_type,
      reasons,
      starts_at,
      location_text,
      max_participants,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/trips/${data.id}`);
}

export async function joinTrip(
  tripId: string,
  message: string | null,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "צריך להיות מחובר" };

  const { error } = await supabase.from("bookings").insert({
    trip_id: tripId,
    user_id: user.id,
    message: message?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") return { error: "כבר ביקשת להצטרף לתוכנית הזו" };
    return { error: error.message };
  }

  revalidatePath(`/trips/${tripId}`);
  revalidatePath("/my-trips");
  return {};
}

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "declined",
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "צריך להיות מחובר" };

  // RLS already enforces that only the trip owner can update.
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select("trip_id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/trips/${data.trip_id}`);
  return {};
}

export async function cancelMyBooking(
  bookingId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "צריך להיות מחובר" };

  const { data: booking } = await supabase
    .from("bookings")
    .select("trip_id, user_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.user_id !== user.id)
    return { error: "אין הרשאה" };

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) return { error: error.message };

  revalidatePath(`/trips/${booking.trip_id}`);
  revalidatePath("/my-trips");
  return {};
}
