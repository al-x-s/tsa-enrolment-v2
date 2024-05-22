// import NextAuth, { type DefaultSession } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/prisma/client";
// import bcrypt from "bcryptjs";
// import { signInSchema } from "@/lib/signInSchema";
// import { User } from "lucide-react";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: string;
//     } & DefaultSession["user"];
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Email",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "Email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       authorize: async (credentials) => {
//         if (!credentials.email || !credentials.password) {
//           return null;
//         }

//         const { email, password } = await signInSchema.parseAsync(credentials);

//         const user = await prisma.user.findUnique({
//           where: { email: email },
//         });

//         if (!user || typeof user.hashedPassword !== "string") {
//           return null;
//         }

//         const passwordsMatch = await bcrypt.compare(
//           password,
//           user.hashedPassword
//         );
//         user.hashedPassword = "";

//         return passwordsMatch ? user : null;
//       },
//     }),
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       return "/admin"; // Redirect to dashboard after sign-in
//     },
//     async session({ session, token, user }) {
//       console.log("session --->", session);
//       console.log("token ---->", token);
//       console.log("user ---->", user);
//       const result = await user;
//       console.log("result --->", result);
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           // role: user.role,
//         },
//       };
//     },
//   },
// });
