"use client";
import React from "react";
import InputCard from "./InputCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/tables/Loading";
import {
  deleteSchool,
  getSchoolById,
} from "@/lib/server_actions/back_end/dbQueries_SCHOOL";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SchoolGeneral = ({ params }: any) => {
  const router = useRouter();
  const school_id = parseInt(decodeURI(params.school_id));

  const {
    data: school_details,
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["school", school_id],
    queryFn: async () => {
      const data = await getSchoolById({ school_id });
      return data;
    },
  });

  if (isPending) {
    return ["1", "2", "3", "4"].map((item) => <Loading key={item} />);
  }

  const handleDelete = async (school_id: number) => {
    const response = await deleteSchool(school_id);
    if (response.isSuccess) {
      router.push("/admin/schools");
    }
  };

  return (
    <>
      <InputCard
        title="School Name"
        fieldName="name"
        school_id={school_id}
        data={school_details}
        inputType="text"
        description="The schools name"
      />
      {/* TODO - Not sure if I want the State/Territory to be editable after the school is created
      <InputCard
        title="State or Territory"
        fieldName="state_territory"
        school_id={school_id}
        data={school_details}
        options={["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]}
        inputType="select"
        description="The schools state or territory"
      /> */}
      <InputCard
        title="Resource Levy"
        fieldName="resource_levy"
        school_id={school_id}
        data={school_details}
        inputType="number"
        description="The per term resource levy charged to parents"
      />
      <InputCard
        title="Facility Hire"
        fieldName="facility_hire"
        school_id={school_id}
        data={school_details}
        inputType="number"
        description="The per term facility hire charged to parents"
      />
      <InputCard
        title="Instrument Rental"
        fieldName="offers_instrument_rental"
        school_id={school_id}
        data={school_details}
        inputType="checkbox"
        label="Check this box if the school offers instrument rental"
        description="Does this school offer instrument rental?"
      />

      <Card className="mb-4 rounded">
        <CardHeader>
          <CardTitle>Delete School</CardTitle>
        </CardHeader>
        <CardContent className="mb-6">
          Delete the school and any data associated with it
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
          <p className="italic">WARNING: Deleting a school cannot be undone.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded" variant="destructive">
                Delete School
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete {school_details?.name}?</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="default"
                    onClick={() => handleDelete(school_id)}
                  >
                    Yes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};

export default SchoolGeneral;
