import React from "react";
import clsx from "clsx";

const ClassTypeAndStatus = ({
  program_status,
  isSelected,
  classType,
}: {
  program_status: string;
  isSelected: boolean;
  classType: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div
        className={clsx(
          "rounded-ee-lg w-fit py-2 px-4 font-semibold text-center",
          program_status === "Inactive" ? "text-[#161616]" : "text-white",
          isSelected ? "bg-[#F3A644] text-[#FEF9EE]" : "bg-[#9689A4]"
        )}
      >
        {classType}
      </div>
      {program_status === "Inactive" && (
        <h2 className="mr-2 text-right font-medium">Not currently enrolling</h2>
      )}
    </div>
  );
};

export default ClassTypeAndStatus;
