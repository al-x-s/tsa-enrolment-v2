"use server";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function getUser() {
  const user = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  return user;
}
