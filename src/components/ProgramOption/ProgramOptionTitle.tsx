import React from "react";

const ProgramOptionTitle = ({
  tuition_fee,
  rehearsal_fee,
  levyFee,
}: {
  tuition_fee: number;
  rehearsal_fee: number;
  levyFee: number;
}) => (
  <h2 className="text-xl my-1 font-ubuntu">
    ${tuition_fee + rehearsal_fee + levyFee} per term
  </h2>
);

export default ProgramOptionTitle;
