import { getCabin, getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  try {
    const { cabinId } = params;

    if (!cabinId) {
      return Response.json({ message: "Missing cabinId" }, { status: 400 });
    }

    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    if (!cabin) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    return Response.json({ cabin, bookedDates });
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
