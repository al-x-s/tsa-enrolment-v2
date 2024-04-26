"use server";

import prisma from "@/prisma/client";
// import { cache } from "react";

export default async function getInstrumentData(
  instrument: string
): Promise<any> {
  const result = await prisma.instrument.findFirst({
    where: { name: instrument },
    include: {
      accessories: true,
    },
  });
  return JSON.parse(JSON.stringify(result));
}
