// "use client";
import React from "react";
import z from "zod";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getSchoolById from "../../getSchoolById";
import InputCard from "../InputCard";

const SchoolInstrumentOptions = async ({ params }: any) => {
  const school_id = parseInt(decodeURI(params.school_id));
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["school", school_id],
    queryFn: async () => {
      const data = await getSchoolById({ school_id });
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InputCard
        title="Instrument Options"
        fieldName="instrument_options"
        school_id={school_id}
        inputType="text"
        description="Options for the schools instruments"
      />
    </HydrationBoundary>
  );
};

export default SchoolInstrumentOptions;
