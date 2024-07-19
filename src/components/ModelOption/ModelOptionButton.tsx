import React from "react";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";

interface ModelOptionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSoldOut: boolean;
  brand: string;
  model: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  asChild?: boolean;
}

const ModelOptionButton = React.forwardRef<
  HTMLButtonElement,
  ModelOptionButtonProps
>(
  (
    { isSoldOut, brand, model, handleClick, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(
          "px-6 py-2 my-4 rounded",
          isSoldOut
            ? "bg-[#979797] text-[#161616]"
            : "text-white bg-gradient-to-br from-theme-600 to bg-theme-900"
        )}
        ref={ref}
        {...props}
        onClick={handleClick}
        value={model}
        type="button"
        disabled={isSoldOut ? true : false}
      >
        {isSoldOut ? "Unavailable" : `Select ${brand}`}
      </Comp>
    );
  }
);

export default ModelOptionButton;
