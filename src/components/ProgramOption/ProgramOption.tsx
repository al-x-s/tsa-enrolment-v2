import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Program } from "@prisma/client";

import ProgramOptionWrapper from "./ProgramOptionWrapper";
import ClassTypeAndStatus from "./ClassTypeAndStatus";
import ProgramOptionTitle from "./ProgramOptionTitle";
import MoreInfoDialog from "./MoreInfoDialog";
import ProgramOptionDescription from "./ProgramOptionDescription";
import WhatsIncluded from "./WhatsIncluded";
import ProgramOptionButton from "./ProgramOptionButton";

type ProgramOptionProps = {
  className?: string;
  schoolProgramStatus: string;
  levyFee: number;
  programData: Program;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  selectedTuitionType: string;
};

const ProgramOption = ({
  className,
  schoolProgramStatus,
  levyFee,
  programData,
  handleClick,
  selectedTuitionType,
  ...props
}: ProgramOptionProps) => {
  const {
    program_status,
    rehearsal_fee,
    tuition_fee,
    type,
    classType,
    description,
  } = programData;
  const programId = programData.id.toString();
  const isSelected = selectedTuitionType === programId ? true : false;
  let status = "Active";
  if (schoolProgramStatus === "Inactive" || program_status === "Inactive") {
    status = "Inactive";
  }
  return (
    <ProgramOptionWrapper isSelected={isSelected} program_status={status}>
      <ClassTypeAndStatus
        program_status={status}
        isSelected={isSelected}
        classType={classType}
      />
      <div className="px-4">
        <div className="flex flex-row items-center mt-4 font-bold">
          <ProgramOptionTitle
            tuition_fee={tuition_fee}
            levyFee={levyFee}
            rehearsal_fee={rehearsal_fee}
          />
          <MoreInfoDialog programData={programData} levyFee={levyFee} />
        </div>
        <ProgramOptionDescription description={description} />
        <WhatsIncluded classType={classType} type={type} />
      </div>
      <div className="flex justify-center">
        <ProgramOptionButton
          programData={programData}
          handleClick={handleClick}
          {...props}
        />
      </div>
    </ProgramOptionWrapper>
  );
};

ProgramOption.displayName = "ProgramOption";

export default ProgramOption;
