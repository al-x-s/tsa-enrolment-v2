import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HireableTableData } from "@/lib/types/types";
import { Instrument } from "@prisma/client";

const InstrumentRentalCosts = ({
  selectedInstrumentData,
  hireableTableData,
  instrument,
}: {
  selectedInstrumentData: Instrument;
  hireableTableData: HireableTableData[];
  instrument: string;
}) => {
  return (
    <article className="bg-[#E6D3F9] p-2 rounded-sm mb-6">
      <h2 className="py-2 text-center font-semibold">
        Instrument Rental Costs
      </h2>
      <Table className="mb-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/5">Item</TableHead>
            <TableHead className="w-2/5 text-right">Price Per Month</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{instrument} Rental</TableCell>
            <TableCell className="text-right">{`$${selectedInstrumentData?.hire_cost}`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Insurance (optional)</TableCell>
            <TableCell className="text-right">{`$${selectedInstrumentData?.hire_insurance}`}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>TOTAL:</TableCell>
            <TableCell className="text-right">{`$${
              (selectedInstrumentData?.hire_cost ?? 0) +
              (selectedInstrumentData?.hire_insurance ?? 0)
            } a month`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Accordion className="px-2" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            What are the rental costs for other instruments?
          </AccordionTrigger>
          <AccordionContent>
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Instruments</TableHead>
                  <TableHead>Cost Per Month</TableHead>
                  <TableHead>Insurance Per Month (optional)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hireableTableData?.map(
                  ({ instruments, hire_cost, insurance_cost }) => (
                    <TableRow key={crypto.randomUUID()}>
                      <TableCell>{instruments.join(", ")}</TableCell>
                      <TableCell>${hire_cost}</TableCell>
                      <TableCell>${insurance_cost}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Do you have a rent to buy scheme?</AccordionTrigger>
          <AccordionContent>
            <p>Yes we do! Here are our terms for the rent to buy scheme:</p>
            <br />
            <ul
              role="list"
              className="flex flex-col gap-1 list list-disc leading-6 pl-6"
            >
              <li className="leading-6">
                The instrument may be purchased at any time throughout the
                rental period.
              </li>
              <li className="leading-6">
                For the first 12 months all rental payments (excluding
                insurance) are deducted from the retail price of the instrument.
              </li>
              <li className="leading-6">
                Between 12 and 24 months 50% of rental payments are deducted
              </li>
              <li className="leading-6">
                After 24 months no more equity is put towards the buyout price.
              </li>
              <li className="leading-6">
                You can contact TSA at any time to obtain a buy-out price. We do
                not contact customers to give updates on buyout prices unless
                requested by you.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </article>
  );
};

export default InstrumentRentalCosts;
