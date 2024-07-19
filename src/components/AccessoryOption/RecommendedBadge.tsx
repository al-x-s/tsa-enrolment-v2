import React from "react";
import clsx from "clsx";

const RecommendedBadge = ({ isSelected }: { isSelected: boolean }) => (
  <div className="relative inline-flex w-[100%]">
    <div
      className={clsx(
        "absolute inset-x-0 mx-auto w-fit h-fit -translate-y-[20%] rounded-sm",
        isSelected ? "bg-[#F3A644]" : "bg-[#979797]"
      )}
    >
      <p className={clsx("text-white px-2 py-1")}>RECOMMENDED</p>
    </div>
  </div>
);

export default RecommendedBadge;
