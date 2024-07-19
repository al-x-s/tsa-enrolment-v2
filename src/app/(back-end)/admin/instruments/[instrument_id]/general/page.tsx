"use client";
import Loading from "@/components/DataTable/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteInstrument,
  getInstrumentById,
} from "@/lib/server_actions/back_end/dbQueries_INSTRUMENT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import InputCard from "./InputCard";

const SchoolGeneral = ({ params }: any) => {
  const router = useRouter();
  const instrument_id = parseInt(decodeURI(params.instrument_id));

  const {
    data: instrument,
    error,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["instrument", instrument_id],
    queryFn: async () => {
      const data = await getInstrumentById(instrument_id);
      return data;
    },
  });

  if (isPending) {
    return ["1", "2", "3", "4"].map((item) => <Loading key={item} />);
  }

  const handleDelete = async (instrument_id: number) => {
    const response = await deleteInstrument(instrument_id);
    if (response.isSuccess) {
      router.push("/admin/instruments");
    }
  };

  return (
    <>
      <InputCard
        title="Instrument Name"
        fieldName="name"
        id={instrument_id}
        data={instrument}
        inputType="text"
        description="The instruments name"
      />
      <InputCard
        title="Program Type"
        fieldName="program_type"
        id={instrument_id}
        data={instrument}
        inputType="select"
        description="The type of program this instrument is associated with"
        options={["Band", "Keyboard", "String", "Guitar"]}
      />
      <InputCard
        title="Instrument Rental"
        fieldName="can_hire"
        id={instrument_id}
        data={instrument}
        inputType="checkbox"
        label="Check this box if the instrument is available to hire"
        description="Can customers hire this instrument?"
      />
      <InputCard
        title="Hire Cost"
        fieldName="hire_cost"
        id={instrument_id}
        data={instrument}
        inputType="number"
        description="The monthly cost to hire this instrument"
      />
      <InputCard
        title="Insurance Cost"
        fieldName="hire_insurance"
        id={instrument_id}
        data={instrument}
        inputType="number"
        description="The monthly cost to insure this instrument"
      />

      <Card className="mb-4 rounded">
        <CardHeader>
          <CardTitle>Delete Instrument</CardTitle>
        </CardHeader>
        <CardContent className="mb-6">
          Delete the instrument and any data associated with it
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
          <p className="italic">
            WARNING: Deleting an instrument cannot be undone.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded" variant="destructive">
                Delete Instrument
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete {instrument?.name}?</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="default"
                    onClick={() => handleDelete(instrument_id)}
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
