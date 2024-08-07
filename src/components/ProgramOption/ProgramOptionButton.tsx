import React from "react";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";

interface ProgramOptionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  program_status: string;
  classType: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  asChild?: boolean;
}

const ProgramOptionButton = React.forwardRef<
  HTMLButtonElement,
  ProgramOptionButtonProps
>(
  (
    {
      className,
      id,
      program_status,
      classType,
      handleClick,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={clsx(
          "px-6 py-2 my-4 rounded",
          program_status === "Inactive"
            ? "bg-[#979797] text-[#161616]"
            : "text-white bg-gradient-to-br from-theme-600 to bg-theme-900"
        )}
        ref={ref}
        {...props}
        onClick={handleClick}
        value={id}
        type="button"
        disabled={program_status === "Inactive"}
      >
        {program_status === "Inactive" ? "Unavailable" : `Select ${classType}`}
      </Comp>
    );
  }
);

export default ProgramOptionButton;
