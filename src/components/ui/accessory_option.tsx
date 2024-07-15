import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Image from "next/image";
import questionButton from "@/images/question-mark-with-circle.svg";

// Types
import { Accessory } from "@prisma/client";

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
import { Switch } from "@/components/ui/switch";

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
  data: Accessory;
  accessories: any;
  updateAccessoriesObject: any;
}

const AccessoryOption = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      data,
      accessories,
      updateAccessoriesObject,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { name, price, is_recommended, description_short, description_long } =
      data;

    const [isSelected, setIsSelected] = React.useState<boolean | undefined>(
      false
    );

    React.useEffect(() => {
      if (!accessories) {
        return;
      }
      setIsSelected(accessories[name]);
    }, [accessories]);

    const handleClick = () => {
      updateAccessoriesObject(name, !isSelected);
    };

    return (
      <div className="max-w-[400px]">
        {is_recommended && (
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
        )}
        <article
          className={clsx(
            "flex flex-row justify-between border-4 rounded-lg p-2 mb-4 h-fit bg-[#E6D3F9] ",
            isSelected ? "border-[#F6BD60]" : "border-[#979797]"
          )}
        >
          <div className={clsx("flex flex-col", is_recommended ? "pt-4" : "")}>
            <div className="flex space-between">
              <h2 className="text-xl font-bold my-1 font-ubuntu">
                {name} - ${price}
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="unstyled"
                    className="bg-transparent hover:fill-ghost p-0 h-fit self-center"
                  >
                    <Image
                      src={questionButton}
                      alt="Accessory Information"
                      className="w-[24px] h-[24px] ml-2 hover:fill-theme-800"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                  </DialogHeader>
                  <p className="leading-8 mb-4 text-theme-grey">
                    {description_long}
                  </p>
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
            <p className="font-light pb-2">{description_short}</p>
          </div>
          <div className="self-center pl-4">
            <Switch
              checked={isSelected}
              onCheckedChange={handleClick}
              aria-readonly
            />
          </div>
        </article>
      </div>
    );
  }
);
AccessoryOption.displayName = "AccessoryOption";

export { AccessoryOption, buttonVariants };
