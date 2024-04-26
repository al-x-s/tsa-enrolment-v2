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

// Helper functions
import filterProgramsByInstrument from "@/lib/helpers/filterProgramsByInstrument";

// Types
import {
  InstrumentOptions,
  Program,
  Programs,
  SchoolData,
  InstrumentData,
  UserData,
} from "@/lib/types";

interface SummaryTableProps {
  schoolData: SchoolData | null;
  instrumentData: InstrumentData | null;
  userData: UserData | null;
}

const SummaryTable = ({
  instrumentData,
  userData,
  schoolData,
}: SummaryTableProps) => {
  if (!userData || !schoolData || !instrumentData) {
    return;
  }
  const {
    selected_program_id,
    hire_purchase_byo,
    inst_is_insured,
    purchased_model,
    accessories,
    instrument,
  } = userData;

  const isHire = hire_purchase_byo === "hire" ? true : false;
  const isPurchase = hire_purchase_byo === "purchase" ? true : false;
  const levy = schoolData.resource_levy;

  // Getting the tuition fee for the selected program
  const programData = schoolData.programs;
  const chosenProgram = programData.filter(
    (program: any) => program.programId.toString() === selected_program_id
  );
  const tuitionFee = chosenProgram[0].program.cost;
  const enrolFee = chosenProgram[0].program.enrol_fee;
  const classType = chosenProgram[0].program.classType;

  // Getting the rental costs
  const hireFee = instrumentData.hire_cost;
  const insuranceFee = inst_is_insured ? instrumentData.hire_cost : 0;

  // Getting the selected accessories
  const selectedAccessories = instrumentData.accessories.filter(
    (accessory) => accessories[accessory.name]
  );

  //   let hasAccessories = false;
  //   if (selectedAccessories.length > 0) {
  //     hasAccessories = true;
  //   }

  const accessoriesTotalCost = selectedAccessories.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  // Getting the cost of any purchased instrument
  const purchasedInstrument = instrumentData.purchase_options.filter(
    (instrument) => instrument.model === purchased_model
  );
  const purchasedInstrumentBrand = purchasedInstrument[0]?.brand;
  const purchasedInstrumentCost = purchasedInstrument[0]?.sale_price;

  return (
    <article className="bg-[#E6D3F9] p-2 rounded-sm ">
      <h2 className="text-center font-semibold">Term Fee's</h2>
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
            <TableCell className="text-right">{`$${tuitionFee}`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>School Levy&#8224;</TableCell>
            <TableCell className="text-right">{`$${levy}`}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Per Term TOTAL</TableCell>
            <TableCell className="text-right">{`$${
              tuitionFee + levy
            }`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {isHire && (
        <>
          <h2 className="text-center font-semibold">Instrument Rental</h2>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Item</TableHead>
                <TableHead className="text-right">Price Per Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{instrumentData.name} Rental</TableCell>
                <TableCell className="text-right">{`$${hireFee}`}</TableCell>
              </TableRow>
              {inst_is_insured && (
                <TableRow>
                  <TableCell>Instrument Insurance</TableCell>
                  <TableCell className="text-right">{`$${insuranceFee}`}</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Monthly TOTAL</TableCell>
                <TableCell className="text-right">{`$${
                  hireFee + insuranceFee
                }`}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}

      <h2 className="text-center font-semibold">Additional Cost's</h2>
      <Table className="mb-4">
        <TableCaption className="text-left px-2">
          * The enrolment fee covers the cost of the method book which students
          will learn from and all the costs associated with enrolment
          administration
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
              <TableCell>{`${purchasedInstrumentBrand} ${purchased_model}`}</TableCell>
              <TableCell className="text-right">{`$${purchasedInstrumentCost}`}</TableCell>
            </TableRow>
          )}
          {selectedAccessories.map((accessory) => (
            <TableRow key={accessory.name}>
              <TableCell>{accessory.name}</TableCell>
              <TableCell className="text-right">{`$${accessory.price}`}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>Enrolment Fee *</TableCell>
            <TableCell className="text-right">{`$${enrolFee}`}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>One Off Payments TOTAL</TableCell>
            <TableCell className="text-right">{`$${
              accessoriesTotalCost +
              enrolFee +
              (isPurchase ? purchasedInstrumentCost : 0)
            }`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex my-4 text-2xl justify-around">
        <h3>Initial Payment Total:</h3>
        <p className="mr-2">{`$${
          tuitionFee +
          levy +
          accessoriesTotalCost +
          enrolFee +
          (isPurchase ? purchasedInstrumentCost : 0) +
          (isHire ? hireFee : 0) +
          (inst_is_insured ? insuranceFee : 0)
        }`}</p>
      </div>
    </article>
  );
};

SummaryTable.displayName = "SummaryTable";

export { SummaryTable };
