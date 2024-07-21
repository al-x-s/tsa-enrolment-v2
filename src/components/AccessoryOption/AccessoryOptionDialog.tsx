import React from "react";
import Image from "next/image";
// import questionButton from "images/question-mark-with-circle.svg";

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

const AccessoryOptionDialog = ({
  name,
  description_long,
}: {
  name: string;
  description_long: string;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="unstyled"
        className="bg-transparent hover:fill-ghost p-0 h-fit self-center"
      >
        <Image
          src={`/images/question-mark-with-circle.svg`}
          height={24}
          width={24}
          alt="Accessory Information"
          className="w-[24px] h-[24px] ml-2 hover:fill-theme-800"
        />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
      </DialogHeader>
      <p className="leading-8 mb-4 text-theme-grey">{description_long}</p>
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

export default AccessoryOptionDialog;
