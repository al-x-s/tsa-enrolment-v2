import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSchoolById } from "../../getSchoolById";
import InputCard from "../InputCard";

const SchoolGeneral = async ({ params }: any) => {
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
        title="School Name"
        fieldName="name"
        school_id={school_id}
        inputType="text"
        description="The schools name"
      />
      <InputCard
        title="Resource Levy"
        fieldName="resource_levy"
        school_id={school_id}
        inputType="number"
        description="The per term resource levy charged to parents"
      />
      <InputCard
        title="Facility Hire"
        fieldName="facility_hire"
        school_id={school_id}
        inputType="number"
        description="The per term facility hire charged to parents"
      />
      <InputCard
        title="Instrument Rental"
        fieldName="offers_instrument_rental"
        school_id={school_id}
        inputType="checkbox"
        label="Check this box if the school offers instrument rental"
        description="Does this school offer instrument rental?"
      />
    </HydrationBoundary>
  );
};

export default SchoolGeneral;
