"use server";
import { validateRequest } from "@/auth";
import { error } from "console";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import prisma from "@/prisma/client";

export async function enable2fa(otp: string, hashedSecret: string) {
  const { user } = await validateRequest();
  if (!user) {
    return error("Access Denied");
  }

  const validOTP = await new TOTPController().verify(
    otp,
    decodeHex(hashedSecret)
  );

  if (validOTP === false) {
    return error("invalid password");
  }

  if (validOTP === true) {
    try {
      const enabled2fa = await prisma.user.update({
        where: {
          username: user?.username,
        },
        data: { mfa_secret_hash: hashedSecret },
      });
      return true;
    } catch (error) {
      return error;
    }
  }
}

export async function disable2fa() {
  const { user } = await validateRequest();
  if (!user) {
    return error("Access Denied");
  }

  try {
    const disabled2fa = await prisma.user.update({
      where: {
        username: user?.username,
      },
      data: { mfa_secret_hash: null },
    });
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function is2faEnabled() {
  const { user } = await validateRequest();
  if (!user) {
    return error("Access Denied");
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { username: user.username },
    });

    const is2faEnabled = existingUser?.mfa_secret_hash === null ? false : true;

    return is2faEnabled;
  } catch (error) {
    console.log(error);
    return error;
  }
}
