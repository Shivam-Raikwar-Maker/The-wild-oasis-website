import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReservationClient from "./ReservationClient";

export default async function Reservation({ cabin }) {
  const [settings, bookedDates, session] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
    getServerSession(authOptions),
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
