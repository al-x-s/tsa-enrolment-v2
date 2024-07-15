import React, { Dispatch, SetStateAction } from "react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { UseFormSetValue } from "react-hook-form";
import clsx from "clsx";

type Image = {
  image: string;
  brand: string;
  model: string;
};

type Images = {
  instrument_name: string;
  images: Image[];
};

const Carousel = ({
  images,
  selected,
  setSelected,
}: {
  images: Images[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  const handleClick = (value: string) => {
    setSelected(value);
  };

  return (
    <section className="flex flex-wrap">
      {images.map(({ instrument_name, images }) => (
        <article key={instrument_name} className=" w-fit p-2">
          <h1 className="text-xl mb-1">{instrument_name}</h1>
          <div className="flex flex-row gap-2">
            {images.map(({ image, brand, model }) => {
              const isSelected = selected === image;

              return (
                <Button
                  key={image}
                  type="button"
                  variant="secondary"
                  className={clsx(
                    "border border-1px p-2 h-fit flex flex-col",
                    isSelected
                      ? "border-orange-500 bg-orange-100 hover:bg-orange-100"
                      : ""
                  )}
                  onClick={() => handleClick(image)}
                >
                  <CldImage
                    width={31 * 2}
                    height={100 * 2}
                    src={image}
                    alt={brand}
                  />
                  <p>{brand}</p>
                </Button>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
};

const Actions = ({ ...props }) => {
  const handleSetValue = (value: string) => {
    props.setValue("image", value, {
      shouldDirty: true,
    });
  };
  return (
    <div className="flex flex-row gap-4 justify-center">
      <DialogClose asChild>
        <Button type="button" variant="secondary">
          Close
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button type="button" onClick={() => handleSetValue(props.selected)}>
          Set Image
        </Button>
      </DialogClose>
    </div>
  );
};

const BrowseImages = ({
  images,
  image_public_id,
  setValue,
}: {
  images: Images[];
  image_public_id: string;
  setValue: UseFormSetValue<{
    image: string;
    rrp: number;
    sale_price: number;
    brand: string;
    model: string;
    status: "Available" | "Sold_Out";
  }>;
}) => {
  const [selected, setSelected] = React.useState("");

  return (
    <>
      <Carousel images={images} setSelected={setSelected} selected={selected} />
      <Actions
        image_public_id={image_public_id}
        selected={selected}
        setValue={setValue}
      />
    </>
  );
};

export default BrowseImages;
