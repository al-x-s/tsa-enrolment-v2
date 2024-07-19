import React from "react";
import { Program } from "@prisma/client";
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

const ProgramOptionDialogTable = ({
  levyFee,
  type,
  tuition_fee,
  rehearsal_fee,
}: {
  levyFee: number;
  type: string;
  tuition_fee: number;
  rehearsal_fee: number;
}) => {
  return (
    <Table>
      {levyFee && (
        <TableCaption className="text-left">
          * The school levy is used to purchase musical equipment and
          accessories for the school as well as to contribute to costs
          associated with band excursions such as hiring buses.
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Item</TableHead>
          <TableHead className="text-right">Price Per Term</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tuition_fee !== 0 && (
          <TableRow>
            <TableCell className="font-medium w-60">Tuition Fee</TableCell>
            <TableCell className="text-right">{`${tuition_fee}`}</TableCell>
          </TableRow>
        )}
        {(type === "Band" || type === "String") && (
          <TableRow>
            <TableCell className="font-medium w-60">Rehearsal Fee</TableCell>
            <TableCell className="text-right">
              {rehearsal_fee === 0 ? "Included" : rehearsal_fee}
            </TableCell>
          </TableRow>
        )}
        {levyFee && (
          <TableRow>
            <TableCell className="font-medium">School Levy *</TableCell>
            <TableCell className="text-right">${levyFee}</TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total Per Term</TableCell>
          <TableCell className="text-right">
            ${tuition_fee + rehearsal_fee + levyFee}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ProgramOptionDialogTable;
