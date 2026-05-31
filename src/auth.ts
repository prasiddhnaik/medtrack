import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function readAuthEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for Google sign-in.`);
  }

  return value;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: readAuthEnv("GOOGLE_CLIENT_ID"),
      clientSecret: readAuthEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  secret: readAuthEnv("AUTH_SECRET"),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      return (profile as { email_verified?: boolean }).email_verified !== false;
    },
  },
};
