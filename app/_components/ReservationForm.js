"use client";

import { differenceInDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01] flex flex-col gap-4">
      {/* Logged-in header */}
      <div className="bg-primary-800 text-primary-300 px-8 py-3 flex justify-between items-center rounded-md">
        <p className="text-sm">Logged in as</p>

        <div className="flex gap-3 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p className="text-sm font-medium">{user.name}</p>
        </div>
      </div>

      {/* ✅ SELECTED DATES DISPLAY (FIX) */}
      {startDate && endDate ? (
        <div className="bg-primary-700 text-primary-200 px-6 py-3 rounded-md text-sm">
          <span className="font-semibold">Selected dates:</span>{" "}
          {startDate.toDateString()} → {endDate.toDateString()}
          <span className="ml-2 text-primary-300">({numNights} nights)</span>
        </div>
      ) : (
        <div className="bg-primary-700 text-primary-300 px-6 py-3 rounded-md text-sm">
          Please select your dates from the calendar
        </div>
      )}

      {/* Reservation form */}
      <form
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-8 px-8 text-lg flex gap-5 flex-col rounded-md"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            disabled={!startDate || !endDate}
          >
            <option value="">Select number of guests...</option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!startDate || !endDate ? (
            <p className="text-primary-300 text-base">
              Select dates to continue
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
