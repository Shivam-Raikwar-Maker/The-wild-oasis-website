import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  try {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today = today.toISOString();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("cabinId", cabinId)
      .or(`startDate.gte.${today},status.eq.checked-in`);

    if (error || !data) {
      console.error(error);
      return [];
    }

    return data
      .map((booking) =>
        eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        }),
      )
      .flat();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images",
    );

    if (!res.ok) throw new Error("Failed to fetch countries");

    const json = await res.json();

    return json.data
      .map((c) => ({
        name: c.name,
        flag: c.flag,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Countries API error:", err);
    return [];
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
/*
export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}
*/
/////////////
// UPDATE

/*
// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
