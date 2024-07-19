import React from "react";
import Image from "next/image";
import { Program } from "@prisma/client";
import questionButton from "@/images/question-mark-with-circle.svg";

// Components
import { Button } from "@/components/ui/button";
import TuitionTypeDialogTable from "./ProgramOptionDialogTable";
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

const MoreInfoDialog = ({
  programData,
  levyFee,
}: {
  programData: Program;
  levyFee: number;
}) => {
  const { classType, type, tuition_fee, rehearsal_fee } = programData;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="unstyled"
          className="bg-transparent hover:fill-ghost p-0 h-fit"
        >
          <Image
            src={questionButton}
            alt="Price breakdown button"
            className="w-[24px] ml-2 hover:fill-theme-800"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{classType} Tuition</DialogTitle>
          <DialogDescription>Price breakdown.</DialogDescription>
        </DialogHeader>
        <TuitionTypeDialogTable
          levyFee={levyFee}
          type={type}
          tuition_fee={tuition_fee}
          rehearsal_fee={rehearsal_fee}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="unstyled"
              className="px-6 py-2 text-white bg-gradient-to-br from-theme-600 to bg-theme-900 rounded my-2 shadow hover:text-theme-grey-light"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreInfoDialog;
