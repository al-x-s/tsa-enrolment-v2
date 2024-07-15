import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Image from "next/image";
import questionButton from "@/images/question-mark-with-circle.svg";
import circleTick from "@/images/circle-tick.svg";

// Types
// import { PurchaseOptions } from "@/lib/types";
import { InstrumentModel } from "@prisma/client";

// Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CldImage } from "next-cloudinary";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  purchase_options: InstrumentModel;
  selectedPurchaseModel: any;
  handleClick: any;
}

const InstrumentPurchaseOption = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      purchase_options,
      handleClick,
      asChild = false,
      selectedPurchaseModel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { brand, model, image, rrp, sale_price, status } = purchase_options;

    const isSoldOut = status === "Sold_Out" ? true : false;
    return (
      <article
        className={clsx(
          "border-4 rounded-lg mb-4 h-fit max-w-[400px]",
          isSoldOut ? "bg-[#B0AFAF]" : "bg-[#E6D3F9]",
          selectedPurchaseModel === model
            ? "border-[#F6BD60]"
            : "border-[#979797]"
        )}
      >
        <div className="flex flex-row justify-between">
          <div className="w-[70%] flex flex-col justify-between ">
            <div
              className={clsx(
                "rounded-ee-lg w-fit py-2 px-4 font-semibold text-center",
                isSoldOut ? "text-[#161616]" : "text-white",
                selectedPurchaseModel === model
                  ? "bg-[#F3A644] text-[#FEF9EE]"
                  : "bg-[#9689A4]"
              )}
            >
              {brand} {isSoldOut ? " - Sold Out" : ""}
            </div>
            <div className="px-4">
              <div className="flex flex-row items-center mt-4 font-bold">
                <h2
                  className={clsx(
                    "text-2xl my-1 font-ubuntu",
                    !isSoldOut ? "text-[#f1933e] font-extrabold" : ""
                  )}
                >
                  {isSoldOut ? `$${rrp}` : `On Sale $${sale_price}`}
                </h2>
              </div>
              {!isSoldOut && (
                <p className="pb-1 font-light">
                  RRP $<span className="line-through">{`${rrp}`}</span>
                </p>
              )}

              <div className="flex flex-row items-center mt-2">
                <Image alt="tick inside a circle" src={circleTick} />
                <p className="ml-2">Brand: {brand}</p>
              </div>
              <div className="flex flex-row items-center mt-2">
                <Image alt="tick inside a circle" src={circleTick} />
                <p className="ml-2">Model: {model}</p>
              </div>
            </div>
            <div className="flex justify-end pr-2">
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
            </div>
          </div>

          <div className="w-[30%] py-2">
            <CldImage
              width="93"
              height="300"
              src={image}
              alt={`Picture of ${brand} ${model}`}
            />
          </div>
        </div>
      </article>
    );
  }
);
InstrumentPurchaseOption.displayName = "InstrumentPurchaseOption";

export { InstrumentPurchaseOption, buttonVariants };
