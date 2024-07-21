import * as React from "react";

// Types
import { Model } from "@prisma/client";

// Components
import { CldImage } from "next-cloudinary";
import ModelOptionWrapper from "./ModelOptionWrapper";
import BrandAndStatus from "./BrandAndStatus";
import ModelPricing from "./ModelPricing";
import DetailsRow from "./DetailsRow";
import ModelOptionButton from "./ModelOptionButton";

type ModelProps = {
  className?: string;
  asChild?: boolean;
  modelData: Model;
  selectedModel: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ModelOption = ({
  className,
  modelData,
  asChild = false,
  selectedModel,
  handleClick,
  ...props
}: ModelProps) => {
  const { brand, model, image, rrp, sale_price, status } = modelData;

  const isSoldOut = status === "Sold_Out" ? true : false;
  return (
    <ModelOptionWrapper
      isSoldOut={isSoldOut}
      model={model}
      selectedModel={selectedModel}
    >
      <div className="flex flex-row justify-between">
        <div className="w-[70%] flex flex-col justify-between ">
          <BrandAndStatus
            brand={brand}
            isSoldOut={isSoldOut}
            selectedModel={selectedModel}
            model={model}
          />
          <div className="px-4">
            <ModelPricing
              isSoldOut={isSoldOut}
              rrp={rrp}
              sale_price={sale_price}
            />

            <DetailsRow label="Brand" value={brand} />
            <DetailsRow label="Model" value={model} />
          </div>
          <div className="flex justify-end pr-2">
            <ModelOptionButton
              isSoldOut={isSoldOut}
              brand={brand}
              model={model}
              handleClick={handleClick}
              {...props}
            />
          </div>
        </div>

        <div className="w-[30%] py-2">
          <CldImage
            width="93"
            height="300"
            src={image}
            alt={`Picture of ${brand} ${model}`}
          />
        </div>
      </div>
    </ModelOptionWrapper>
  );
};
ModelOption.displayName = "ModelOption";

export { ModelOption };
