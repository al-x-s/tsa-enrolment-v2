import * as React from "react";

import clsx from "clsx";

// Types
import { Accessory } from "@prisma/client";

// Components
import { Switch } from "@/components/ui/switch";
import RecommendedBadge from "./RecommendedBadge";
import AccessoryOptionWrapper from "./AccessoryOptionWrapper";
import AccessoryOptionTitleAndPrice from "./AccessoryOptionTitleAndPrice";
import AccessoryOptionDialog from "./AccessoryOptionDialog";
import ShortDescription from "./ShortDescription";

type AccessoryOptionProps = {
  data: Accessory;
  accessories: any;
  updateAccessoriesObject: any;
};

const AccessoryOption = ({
  data,
  accessories,
  updateAccessoriesObject,
}: AccessoryOptionProps) => {
  const { name, price, is_recommended, description_short, description_long } =
    data;

  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!accessories) {
      return;
    }
    setIsSelected(accessories[name]);
  }, [accessories]);

  const handleClick = () => {
    updateAccessoriesObject(name, !isSelected);
  };

  return (
    <div className="max-w-[400px]">
      {is_recommended && <RecommendedBadge isSelected={isSelected} />}
      <AccessoryOptionWrapper isSelected={isSelected}>
        <div className={clsx("flex flex-col", is_recommended ? "pt-4" : "")}>
          <div className="flex space-between">
            <AccessoryOptionTitleAndPrice name={name} price={price} />
            <AccessoryOptionDialog
              name={name}
              description_long={description_long}
            />
          </div>
          <ShortDescription description_short={description_short} />
        </div>
        <div className="self-center pl-4">
          <Switch
            checked={isSelected}
            onCheckedChange={handleClick}
            aria-readonly
          />
        </div>
      </AccessoryOptionWrapper>
    </div>
  );
};
AccessoryOption.displayName = "AccessoryOption";

export { AccessoryOption };
