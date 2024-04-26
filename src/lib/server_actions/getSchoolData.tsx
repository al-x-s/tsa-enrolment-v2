"use server";

import prisma from "@/prisma/client";
import { cache } from "react";

export default cache(async function getSchoolData(
  schoolName: string
): Promise<any> {
  const result = await prisma.school.findFirst({
    where: { name: schoolName },
    include: {
      programs: { include: { program: true } },
    },
  });
  return JSON.parse(JSON.stringify(result));
});
