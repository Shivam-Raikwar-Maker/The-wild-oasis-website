"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");
  return session;
}

// ✅ UPDATE GUEST
export async function updateGuest(formData) {
  const session = await getSession();

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const { error } = await supabase
    .from("guests")
    .update({ nationality, countryFlag, nationalID })
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

// ✅ CREATE BOOKING
export async function createBooking(bookingData, formData) {
  const session = await getSession();

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

// ✅ DELETE BOOKING
export async function deleteBooking(bookingId) {
  const session = await getSession();

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((b) => b.id);

  if (!guestBookingIds.includes(bookingId)) throw new Error("Not allowed");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

// ✅ UPDATE BOOKING
export async function updateBooking(formData) {
  const session = await getSession();
  const bookingId = Number(formData.get("bookingId"));

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((b) => b.id);

  if (!guestBookingIds.includes(bookingId)) throw new Error("Not allowed");

  const { error } = await supabase
    .from("bookings")
    .update({
      numGuests: Number(formData.get("numGuests")),
      observations: formData.get("observations").slice(0, 1000),
    })
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be updated");

  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

// ✅ SIGN IN
export async function signInAction() {
  redirect("/api/auth/signin?callbackUrl=/account");
}

// ✅ SIGN OUT
export async function signOutAction() {
  redirect("/api/auth/signout?callbackUrl=/");
}
