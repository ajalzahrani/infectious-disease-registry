import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "LAB_DOCTOR" | "INFECTIOUS_DOCTOR";
    } & DefaultSession["user"];
  }
}
