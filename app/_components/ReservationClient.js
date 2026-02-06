"use client";

import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import LoginMessage from "./LoginMessage";
import { ReservationProvider } from "./ReservationContext";

export default function ReservationClient({
  cabin,
  settings,
  bookedDates,
  session,
}) {
  return (
    <ReservationProvider>
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[2fr_1.2fr]
          border
          border-primary-800
          bg-primary-900
          min-h-[420px]
          rounded-xl
          overflow-hidden
        "
      >
        {/* LEFT */}
        <div className="p-6 xl:p-8 border-b xl:border-b-0 xl:border-r border-primary-800">
          <DateSelector
            settings={settings}
            bookedDates={bookedDates}
            cabin={cabin}
          />
        </div>

        {/* RIGHT */}
        <div className="p-8 xl:p-10 bg-primary-800 flex flex-col gap-8">
          {session?.user ? (
            <ReservationForm cabin={cabin} user={session.user} />
          ) : (
            <LoginMessage />
          )}
        </div>
      </div>
    </ReservationProvider>
  );
}
