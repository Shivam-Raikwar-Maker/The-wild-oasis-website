import { getCabin, getCabins } from "@/app/_lib/data-service";
import Reservation from "@/app/_components/Reservation";
import { ReservationProvider } from "@/app/_components/ReservationContext";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

// Metadata
export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return {
    title: `Cabin ${name}`,
  };
}

// Static params
export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
}

// Page
export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
        Reserve {cabin.name} today. Pay on arrival.
      </h2>

      <Suspense fallback={<Spinner />}>
        <ReservationProvider>
          <Reservation cabin={cabin} />
        </ReservationProvider>
      </Suspense>
    </div>
  );
}
