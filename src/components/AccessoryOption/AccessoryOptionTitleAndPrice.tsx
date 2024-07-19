import React from "react";

const AccessoryOptionTitleAndPrice = ({
  name,
  price,
}: {
  name: string;
  price: number;
}) => (
  <h2 className="text-xl font-bold my-1 font-ubuntu">
    {name} - ${price}
  </h2>
);

export default AccessoryOptionTitleAndPrice;
