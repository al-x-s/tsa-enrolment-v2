"use server";

import prisma from "@/prisma/client";
import { cache } from "react";

interface SchoolNames {
  name: string;
}

export default cache(async function getSchoolNames(): Promise<SchoolNames[]> {
  const result = await prisma.school.findMany({
    select: { name: true },
  });
  return JSON.parse(JSON.stringify(result));
});
