import React from "react";

// Components
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

// Types
import { FormSelections } from "@/lib/types/types";
import { Accessory, Instrument, Model } from "@prisma/client";

interface SummaryTableProps {
  schoolData: any | null;
  selectedModelData: Model;
  selectedAccessoriesData: Accessory[];
  formSelections: FormSelections;
  selectedProgramData: any;
  selectedInstrumentData: Instrument;
}

const SummaryTable = ({
  selectedModelData,
  formSelections,
  schoolData,
  selectedAccessoriesData,
  selectedProgramData,
  selectedInstrumentData,
}: SummaryTableProps) => {
  const {
    selected_program_id,
    hire_purchase_byo,
    inst_is_insured,
    purchased_model,
    accessories,
    instrument,
  } = formSelections;

  const isHire = hire_purchase_byo === "hire" ? true : false;
  const isPurchase = hire_purchase_byo === "purchase" ? true : false;
  const { levyFee } = schoolData;

  const { rehearsal_fee, tuition_fee, enrol_fee, classType } =
    selectedProgramData;

  // Getting the rental costs
  const hireFee = selectedInstrumentData.hire_cost;
  const insuranceFee = inst_is_insured
    ? selectedInstrumentData.hire_insurance
    : 0;

  const accessoriesTotalCost = selectedAccessoriesData?.reduce(
    (total, item) => {
      return total + Number(item.price);
    },
    0
  );

  // Getting the cost of any purchased instrument
  let brand, sale_price;
  if (purchased_model) {
    brand = selectedModelData.brand;
    sale_price = selectedModelData.sale_price;
  }

  return (
    <article className="bg-[#E6D3F9] p-2 rounded-sm ">
      <h2 className="text-center font-semibold">Term Fees</h2>
      <Table className="mb-4">
        <TableCaption className="text-left px-2">
          &#8224; The school levy is used to purchase musical equipment and
          accessories for the school as well as to contribute to costs
          associated with band excursions such as hiring buses.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Item</TableHead>
            <TableHead className="text-right">Price Per Term</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{`${classType} `}Tuition Fees</TableCell>
            <TableCell className="text-right">{`$${
              tuition_fee + rehearsal_fee
            }`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>School Levy&#8224;</TableCell>
            <TableCell className="text-right">{`$${levyFee}`}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Per Term TOTAL</TableCell>
            <TableCell className="text-right">{`$${
              tuition_fee + rehearsal_fee + levyFee
            }`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {(isPurchase || selectedAccessoriesData.length > 0) && (
        <>
          <h2 className="text-center font-semibold">Additional Costs</h2>
          <Table className="mb-4">
            <TableCaption className="text-left px-2">
              There will also be a one off enrolment fee of ${enrol_fee} which
              covers the cost of the method book which students will learn from
              and all the costs associated with enrolment administration
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Item</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPurchase && (
                <TableRow>
                  <TableCell>{`${brand} ${purchased_model} ${instrument}`}</TableCell>
                  <TableCell className="text-right">{`$${sale_price}`}</TableCell>
                </TableRow>
              )}
              {selectedAccessoriesData?.map((accessory: any) => (
                <TableRow key={accessory.name}>
                  <TableCell>{accessory.name}</TableCell>
                  <TableCell className="text-right">{`$${accessory.price}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </article>
  );
};

SummaryTable.displayName = "SummaryTable";

export { SummaryTable };
