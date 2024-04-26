"use server";

import prisma from "@/prisma/client";
// import { cache } from "react";

interface SchoolNames {
  name: string;
}

export default async function getSchoolNames(): Promise<SchoolNames[]> {
  try {
    const result = await prisma.school.findMany({
      select: { name: true },
    });

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    return JSON.parse(JSON.stringify(error));
  }
}
