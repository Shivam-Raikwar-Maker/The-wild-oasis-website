import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Navigation() {
  const session = await getServerSession(authOptions);

  const user = session?.user ?? null;
  const userImage = user?.image || "/logo.png";
  const userName = user?.name || "Guest";

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>

        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>

        <li>
          <Link
            href="/account"
            className="hover:text-accent-400 transition-colors flex items-center gap-4"
          >
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={userImage}
                alt={userName}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>

            <span>Guest area</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
