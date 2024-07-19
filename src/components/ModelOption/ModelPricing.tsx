import React from "react";
import clsx from "clsx";

const ModelPricing = ({
  isSoldOut,
  rrp,
  sale_price,
}: {
  isSoldOut: boolean;
  rrp: number;
  sale_price: number;
}) => (
  <>
    <div className="flex flex-row items-center mt-4 font-bold">
      <h2
        className={clsx(
          "text-2xl my-1 font-ubuntu",
          !isSoldOut ? "text-[#f1933e] font-extrabold" : ""
        )}
      >
        {isSoldOut ? `$${rrp}` : `On Sale $${sale_price}`}
      </h2>
    </div>
    {!isSoldOut && (
      <p className="pb-1 font-light">
        RRP $<span className="line-through">{`${rrp}`}</span>
      </p>
    )}
  </>
);

export default ModelPricing;
