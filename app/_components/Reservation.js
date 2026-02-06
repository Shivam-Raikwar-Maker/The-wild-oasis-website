import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { auth } from "../_lib/auth";
import ReservationClient from "./ReservationClient";

export default async function Reservation({ cabin }) {
  const [settings, bookedDates, session] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
    auth(),
  ]);

  return (
    <ReservationClient
      cabin={cabin}
      settings={settings}
      bookedDates={bookedDates}
      session={session}
    />
  );
}
