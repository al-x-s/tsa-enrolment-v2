import { ScrollArea } from "@/components/ui/scroll-area";

export const rentalTermsCheckboxes = [
  {
    id: "1",
    name: "instrument_options.agree_rental_terms.1",
    term: "I have read, understood and agree to all the Instrument Rental Agreement Terms and Conditions.",
  },
  {
    id: "2",
    name: "instrument_options.agree_rental_terms.2",
    term: "I understand that I need to have funds available on the 1st of every month, otherwise I may be charged a $3 dishonour/administration fee.",
  },
  {
    id: "3",
    name: "instrument_options.agree_rental_terms.3",
    term: "I understand that the minimum hire period is 3 months, and that at any point after that I can continue to rent, return my instrument at no charge, or choose to buy it out.",
  },
  {
    id: "4",
    name: "instrument_options.agree_rental_terms.4",
    term: "I understand that it is my responsibility to return the instrument to Teaching Services Australia (Dural Music Centre) BEFORE the 1st of the month otherwise the following month will be charged.",
  },
  {
    id: "5",
    name: "instrument_options.agree_rental_terms.5",
    term: "I understand that to calculate my buyout, 100% of my rental payments (excl. Insurance) are deducted from RRP in the first 12 months, 50% of my payments deducted for the following 12 months, and none of my payments in the 3rd year go towards the purchase price.",
  },
  {
    id: "6",
    name: "instrument_options.agree_rental_terms.6",
    term: "I understand that it is my responsibility to contact TSA to obtain a buyout price at any stage throughout the rental period.",
  },
  {
    id: "7",
    name: "instrument_options.agree_rental_terms.7",
    term: " I understand that if I DO NOT select insurance, I am liable for all servicing and repairs to my instrument (including if my instrument is returned damaged).",
  },
];

export function RentalTermsDialogContent() {
  return (
    <ScrollArea className="text-left h-[60vh] md:h-[50vh] px-2 md:px-8 mb-1">
      <p className="text-lg text-theme-grey font-semibold mb-2">
        1. Minimum Rental Period
      </p>
      <p className="leading-8 mb-4 text-theme-grey">
        The initial rental period is a minimum of 3 calendar months
        (approximately 1 term), then on a monthly basis.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">2. Payment</p>
      <p className="leading-8 mb-2 text-theme-grey">
        Rental charges are monthly and will be debited from your credit card or
        bank account on the 1st of each month. Payments are non-refundable.
      </p>
      <p className="leading-8 mb-2 text-theme-grey">
        The first payment is due when the instrument is shipped and will incur
        an{" "}
        <span className="text-semibold">
          additional packing/delivery fee of $10
        </span>
        .
      </p>
      <p className="leading-8 mb-2 text-theme-grey">
        It is your responsibility to ensure that there are
        <span className="text-semibold">sufficient funds</span>
        available in your account to allow the monthly payments. A fee of
        <span className="text-semibold">$3 per day</span>
        will occur if:
      </p>
      <ul className="list-disc mt-2 ml-4">
        <li>There are insufficient funds available,</li>
        <li>The bank account has been closed,</li>
        <li>The credit/debit card has been cancelled or has expired</li>
      </ul>
      <p className="leading-8 mb-4 text-theme-grey">
        Continued non-payment may incur reposession of instrument.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        3. Loss and Damage - Optional Insurance Cover (recommended)
      </p>
      <p className="leading-8 mb-2 text-theme-grey">
        If you <span className="text-semibold">do not</span> choose optional
        insurance cover then you are responsible for{" "}
        <span className="text-semibold">any</span> loss or damage caused to the
        instrument and will be responsible to pay for all repairs/replacement of
        the instrument. TSA must be notified within 48 hours of any loss or
        damage.
      </p>
      <p className="leading-8 mb-4 text-theme-grey">
        Optional insurance can be taken to cover theft/fire/accidental damage to
        the instrument. The optional insurance
        <span className="text-semibold">does not</span>
        cover loss or damage due to negligence of the hirer. Insurance
        <span className="text-semibold">does not</span>
        cover instrument whilst in transit by post. No repairs or maintenance
        are to be instigated by the customer. All work on this instrument is
        done through Teaching Services Australia.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        4. Ownership of the Product
      </p>
      <p className="leading-8 mb-4 text-theme-grey">
        The product remains the property of the vendor throughout the hire
        period
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        5. Returning Instruments
      </p>
      <p className="leading-8 mb-2 text-theme-grey">
        Instruments must be returned before the next payment date (end of
        month), or the next month will be charged. Instruments must be in our
        possession at Teaching Services Australia before the direct debit will
        be cancelled.{" "}
        <span className="text-semibold">
          The return arrangements must be made at your initiative well ahead of
          time
        </span>
        .
      </p>
      <p className="leading-8 mb-4 text-theme-grey">
        Customers are responsible for instruments if posted or couriered and we
        strongly recommend instruments are registered if sent by post. We
        encourage customers to return instruments in person to TSA and Dural
        Music Centre at{" "}
        <span className="text-semibold">
          Unit 32/286-288 New Line Road, Dural NSW 2158
        </span>{" "}
        (behind Dural McDonalds). Alternatively, we recommend you use Australia
        Post or any reliable courier service.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        6. Service and Repairs (only applies if you choose optional insurance)
      </p>
      <p className="leading-8 mb-2 text-theme-grey">
        If you have selected the optional insurance any general service and
        maintenance is provided.{" "}
        <span className="text-semibold">
          Consumables such as reeds/cork grease/valve oil are initially
          provided, but replishment is at your own expense
        </span>
        .
      </p>
      <p className="leading-8 mb-4 text-theme-grey">
        It is the customers responsibility to get the instrument back to TSA at
        their expensive if repairs of maintenance is to be carried out. We
        recommend you deliver the instrument in person, or alternatively use
        Australia Post or any other reliable courier service.
      </p>
    </ScrollArea>
  );
}
