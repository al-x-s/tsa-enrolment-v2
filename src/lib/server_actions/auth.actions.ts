"use server";
// Database
import prisma from "@/prisma/client";
// Schema
import { z } from "zod";
import { signInSchema } from "@/lib/schemas/schema";
// Lucia Auth
import { lucia, validateRequest } from "@/auth";
import { Argon2id } from "oslo/password";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";

import { cookies } from "next/headers";
import { error } from "console";

export const createSession = async (userId: string) => {
  console.log("create session user ID ->>>", userId);
  const session = await lucia.createSession(userId, {
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
      error: "Invalid username or password",
    };
  }

  if (!existingUser.password_hash) {
    return {
      error: "Invalid username or password",
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

  const is2faEnabled = existingUser.mfa_secret_hash === null ? false : true;

  if (is2faEnabled) {
    if (values?.otp === undefined) {
      return;
    }

    if (values?.otp.length === 6) {
      let hashedSecret: string = "";

      if (existingUser?.mfa_secret_hash === null) {
        return;
      } else {
        hashedSecret = existingUser?.mfa_secret_hash;
      }

      const validOTP = await new TOTPController().verify(
        values.otp,
        decodeHex(hashedSecret)
      );

      if (validOTP === false) {
        return { error: "Invalid Code - Please try again" };
      } else if (validOTP === true) {
        const res = createSession(existingUser.id);
        return res;
      }
    } else {
      const message: any = { message: "2FA Required" };
      return message;
    }
  }

  if (!is2faEnabled) {
    const res = createSession(existingUser.id);
    return res;
  }
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
