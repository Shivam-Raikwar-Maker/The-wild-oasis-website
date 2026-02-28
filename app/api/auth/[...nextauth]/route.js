import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest } from "@/app/_lib/data-service";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const existingGuest = await getGuest(user.email);

      if (!existingGuest) {
        await createGuest({
          email: user.email,
          fullName: user.name,
        });
      }

      return true;
    },

    async session({ session }) {
      const guest = await getGuest(session.user.email);
      if (guest) session.user.guestId = guest.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
