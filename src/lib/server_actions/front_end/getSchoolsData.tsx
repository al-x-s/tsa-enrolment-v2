"use server";

import prisma from "@/prisma/client";
// import { cache } from "react";

type SchoolsData = {
  name: string;
  welcome_message: string;
};

type Data = {
  [key: string]: SchoolsData;
};

export default async function getSchoolsData(): Promise<Data> {
  try {
    const data = await prisma.school.findMany({
      select: { name: true, welcome_message: true },
    });

    const result = data.reduce((acc, school) => {
      acc[school.name] = {
        name: school.name,
        welcome_message: school.welcome_message,
      };
      return acc;
    }, {} as { [key: string]: SchoolsData });

    return result;
  } catch (error) {
    throw error;
  }
}
