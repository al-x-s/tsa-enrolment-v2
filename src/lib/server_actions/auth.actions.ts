"use server";
import { z } from "zod";
import { signInSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/auth";

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  try {
    signInSchema.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: { email: values.email },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  if (!existingUser.password_hash) {
    return {
      error: "User not found",
    };
  }

  const argon2id = new Argon2id();

  const isValidPassword = await argon2id.verify(
    existingUser.password_hash,
    values.password
  );

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {
    // 24 Hours
    // expiresIn: 60 * 60 * 24 * 1,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: "Logged in successfully",
  };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
