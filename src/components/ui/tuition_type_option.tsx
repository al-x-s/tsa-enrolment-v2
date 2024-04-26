import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Image from "next/image";
import questionButton from "@/images/question-mark-with-circle.svg";
import circleTick from "@/images/circle-tick.svg";

// Types
import { Program } from "@/lib/types";

// Components
import { Button } from "@/components/ui/button";
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
  levyFee: any;
  programData: Program;
  handleClick: any;
  selectedTuitionType: string;
}

const TuitionTypeOption = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      levyFee,
      programData,
      handleClick,
      selectedTuitionType,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const program_status = programData.program_status;
    const programId = programData.id.toString();
    const isSelected = selectedTuitionType === programId ? true : false;
    return (
      <article
        className={clsx(
          "border-4 rounded-lg mb-4",
          program_status === "Inactive" ? "bg-[#B0AFAF]" : "bg-[#E6D3F9]",
          isSelected ? "border-[#F6BD60]" : "border-[#979797]"
        )}
      >
        <div className="flex justify-between items-center">
          <div
            className={clsx(
              "rounded-ee-lg w-fit py-2 px-4 font-semibold text-center",
              program_status === "Inactive" ? "text-[#161616]" : "text-white",
              isSelected ? "bg-[#F3A644] text-[#FEF9EE]" : "bg-[#9689A4]"
            )}
          >
            {programData.classType}
          </div>
          {program_status === "Inactive" && (
            <h2 className="mr-2 text-right font-medium">
              Not currently enrolling
            </h2>
          )}
        </div>

        <div className="px-4">
          <div className="flex flex-row items-center mt-4 font-bold">
            <h2 className="text-xl my-1 font-ubuntu">
              ${programData.cost + levyFee} per term
            </h2>
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
                  <DialogTitle>{programData.classType} Tuition</DialogTitle>
                  <DialogDescription>Price breakdown.</DialogDescription>
                </DialogHeader>
                <Table>
                  {levyFee && (
                    <TableCaption className="text-left">
                      * The school levy is used to purchase musical equipment
                      and accessories for the school as well as to contribute to
                      costs associated with band excursions such as hiring
                      buses.
                    </TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Item</TableHead>
                      <TableHead className="text-right">
                        Price Per Term
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programData.cost_breakdown.map((cost) => (
                      <TableRow key={crypto.randomUUID()}>
                        <TableCell className="font-medium w-60">
                          {cost.item}
                        </TableCell>
                        <TableCell className="text-right">
                          {cost.price}
                        </TableCell>
                      </TableRow>
                    ))}
                    {levyFee && (
                      <TableRow>
                        <TableCell className="font-medium">
                          School Levy *
                        </TableCell>
                        <TableCell className="text-right">${levyFee}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>Total Per Term</TableCell>
                      <TableCell className="text-right">
                        ${programData.cost + levyFee}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
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
          </div>
          <p className="pb-1 font-light">{programData.description}</p>
          {programData.whats_included.map((value) => (
            <div
              key={crypto.randomUUID()}
              className="flex flex-row items-center mt-2"
            >
              <Image alt="tick inside a circle" src={circleTick} />
              <p className="ml-2">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
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
            value={programData.id}
            type="button"
            disabled={program_status === "Inactive" ? true : false}
          >
            {program_status === "Inactive"
              ? "Unavailable"
              : `Select ${programData.classType}`}
          </Comp>
        </div>
      </article>
    );
  }
);
TuitionTypeOption.displayName = "TuitionTypeOption";

export { TuitionTypeOption, buttonVariants };
