"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { Argon2id } from "oslo/password";
import { userSchema } from "@/lib/schema";
import { validateRequest } from "@/auth";

type User = {
  username?: string;
  current?: string;
  new_password?: string;
  confirm_password?: string;
  email?: string;
  role?: string;
};

const deleteUser = async ({ target_id }: { target_id: string }) => {
  const result = prisma.user.delete({
    where: {
      id: target_id,
    },
  });
  return result;
};

const updateUser = async ({
  formData,
  user_id,
  field,
}: {
  formData: User;
  user_id: string;
  field: string;
}) => {
  if (field === "username") {
    return updateUsername({ formData, user_id });
  } else if (field === "password") {
    return updatePassword({ formData, user_id });
  }

  const parsed = userSchema.safeParse(formData);

  if (parsed.success) {
    try {
      const result = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        },
      });

      if (result) {
        return result;
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
};

const updatePassword = async ({
  formData,
  user_id,
}: {
  formData: User;
  user_id: string;
}) => {
  const { current, new_password, confirm_password } = formData;

  if (!current || !new_password) {
    return {
      isSuccess: false,
      error: {
        message: "Missing form data",
      },
    };
  }

  if (new_password !== confirm_password) {
    return {
      isSuccess: false,
      error: {
        message: "new password and confirm new password don't match",
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: { id: user_id },
  });

  if (!user) {
    return {
      isSuccess: false,
      error: {
        message: "No user found",
      },
    };
  }

  const argon2id = new Argon2id();

  const isValidPassword = await argon2id.verify(user.password_hash, current);

  if (!isValidPassword) {
    return {
      isSuccess: false,
      error: {
        message: "Incorrect current password",
      },
    };
  }

  const password_hash = await argon2id.hash(new_password);

  try {
    const result = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        password_hash: password_hash,
      },
    });
    if (result) {
      return { isSuccess: true };
    }
  } catch (error) {
    throw error;
  }
};

const updateUsername = async ({
  formData,
  user_id,
}: {
  formData: User;
  user_id: string;
}) => {
  try {
    const result = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        username: formData.username,
      },
    });
    revalidatePath("/admin/my_account");
    return { isSuccess: true };
  } catch (error) {
    throw error;
  }
};

const getUsers = async (user_id: string) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: user_id,
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (users) {
    return users;
  }
};

export { updateUsername, updateUser, getUsers, deleteUser };
