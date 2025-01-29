import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

const getUserFromDb = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }
  return user;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Starting authorization attempt");

          if (!credentials?.username || !credentials?.password) {
            console.log("Missing credentials in request");
            throw new Error("Missing credentials");
          }

          const username = credentials.username as string;
          console.log("Looking up user:", username);

          // First get the user
          const user = await getUserFromDb(username);
          console.log("User found:", !!user);

          if (!user || !user.password) {
            console.log("User not found or missing password");
            throw new Error("Invalid credentials");
          }

          // Compare the provided password with stored hash
          console.log("Comparing passwords...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Invalid password");
            throw new Error("Invalid credentials");
          }

          // Return user without password
          const { password: _, ...userWithoutPassword } = user;
          console.log("Auth successful");
          return userWithoutPassword;
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token, "User:", user);
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session, "Token:", token);
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});
