"use server";

import prisma from "@/prisma/client";
import generateInstrumentSelectMap from "../../helpers/generateInstrumentSelectMap";

function getEnrolmentYear() {
  const today = new Date();
  const month = today.getMonth() + 1;
  let year = today.getFullYear();
  const october = 10;
  if (month >= october) {
    year++;
  }
  return year;
}

export default async function getSchoolData(schoolName: string): Promise<any> {
  const schoolData = await prisma.school.findFirst({
    where: { name: schoolName },
    include: {
      grades: {
        include: { grade: true },
        orderBy: { grade: { order: "asc" } },
      },
      instruments: {
        where: {
          status: { not: "Hidden" },
        },
        include: {
          instrument: true,
        },
        orderBy: { instrument: { program_type: "asc" } },
      },
    },
  });

  const schoolId = schoolData?.id;
  const levyFee = schoolData?.resource_levy;
  const enrolmentYear = getEnrolmentYear();
  const grades = schoolData?.grades;
  const instruments = generateInstrumentSelectMap(schoolData?.instruments);
  return JSON.parse(
    JSON.stringify({
      grades,
      levyFee,
      instruments,
      schoolId,
      enrolmentYear,
    })
  );
}
