"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

type User = {
  username?: string;
  current?: string;
  new?: string;
  new_confirm?: string;
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
};

const updatePassword = async ({
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

export { updateUsername, updateUser };
