import React from "react";

const ShortDescription = ({
  description_short,
}: {
  description_short: string;
}) => <p className="font-light pb-2">{description_short}</p>;

export default ShortDescription;
