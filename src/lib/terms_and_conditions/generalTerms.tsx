import { ScrollArea } from "@/components/ui/scroll-area";

export function GeneralTermsDialogContent() {
  return (
    <ScrollArea className="text-left h-[60vh] md:h-[50vh] px-2 md:px-8 mb-1">
      <p className="text-lg text-theme-grey font-semibold mb-2">1. Fee's</p>
      <p className="leading-8 mb-4">
        Fees are payable at the commencement of each term and include all
        tutorials/band rehearsals and performances for the term. If a public
        holiday, pupil-free day or other 'whole school' activity occurs and{" "}
        <span className="font-bold">less than 9 lessons/performances</span> are
        achieved in that term, an alternative lesson/performance opportunity
        will be provided. Due to timetabling restrictions & varying term
        lengths, this extra lesson/performance may not always take place in the
        same term.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">2. Payment</p>
      <p className="leading-8 mb-4">
        If you have not chosen to set up a direct debit, an invoice will be
        emailed to you at the beginning of each term and is{" "}
        <span className="font-bold">payable within 14 days</span>. Payment
        options include credit card, EFT and Direct Debit. You may incur late
        fees or your child may be excluded from rehearsals and lessons if fees
        are unpaid. NOTE - TSA is registered for NSW Government's 'Creative
        Kids' program. If you are eligible for this voucher, details on how to
        use it towards your school band fees can be found on the TSA website.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        3. Student Absences
      </p>
      <p className="leading-8 mb-4">
        Tuition is a{" "}
        <span className="font-bold">commitment for a full term</span>. Due to
        the nature of group lessons, individual student absences cannot be made
        up. As such, no refund is provided for student absences from group
        lessons.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        4. Withdrawal
      </p>
      <p className="leading-8 mb-4">
        Minimum commitment for tuition is one term. Notice of withdrawal must be
        given to the TSA office{" "}
        <span className="font-bold">prior to the new term commencing</span> or
        that term's tuition fees will be charged. No refund is given for
        mid-term withdrawal (we will give consideration for hardship).
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">5. Practice</p>
      <p className="leading-8 mb-4">
        It is expected that students will spend regular time at home practising
        their instrument. At least three 30 minute practices per week are
        required to make sustained progress.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        6. Correspondence
      </p>
      <p className="leading-8 mb-4">
        Enrolment, fees and general enquiries should be directed to the TSA main
        office. The most effective means of contact is by calling or emailing
        the TSA office directly. Your child's school office will not be
        responsible for handling TSA business. Notes sent to school often take
        days or weeks to arrive at TSA so please contact TSA{" "}
        <span className="font-bold">directly</span>.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        7. Instrument
      </p>
      <p className="leading-8 mb-4">
        Buying or hiring an instrument is an extra cost and is not included in
        tuition fees. It will also become obvious that some instruments cost
        more than others. If price is an obstacle we encourage you to contact us
        for advice and avoid buying a cheap version of an expensive instrument
        as this can end up costing you more in repairs and depreciation. See the
        Instrument Purchase Agreement for further tips.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        8. Resource and Facility Hire Levy
      </p>
      <p className="leading-8 mb-4">
        Running a school band program requires resources such as sheet music,
        music stands at school, percussion equipment, amplifiers, etc. This is
        covered by TSA's resource levy. Some schools may also charge a facility
        hire fee for music lessons to be held at the school.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        9. Enrolment Fee
      </p>
      <p className="leading-8 mb-4">
        The enrolment fee is a one off compulsory fee that covers the Method
        Book and all enrolment administration for your child to join the school
        band.
      </p>
      <p className="text-lg text-theme-grey font-semibold mb-2">
        10. Photography and Video
      </p>
      <p className="leading-8 mb-4">
        TSA occasionally uses photographs and video recordings of students on
        its website, in brochures, newsletters and other promotional material.
        No personal details or surnames will be used and photos are used in
        accordance with TSA's Child-Safe polices. If you do not wish TSA to
        display photographs of your child please notify TSA in writing or via
        email{" "}
        <Link
          href="mailto:enrolments@teachingservices.com.au"
          className="text-theme-900"
        >
          enrolments@teachingservices.com.au
        </Link>
      </p>
    </ScrollArea>
  );
}
