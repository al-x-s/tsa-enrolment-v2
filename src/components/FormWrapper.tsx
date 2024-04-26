import clsx from "clsx";

export default function FormWrapper({
  children,
  heading,
  description,
}: FormWrapperProps) {
  return (
    <section
      className={clsx(
        "flex flex-col w-full h-full rounded-lg",
        " pt-7 lg:pt-12  lg:rounded-t-lg lg:rounded-b-none",
        "bg-gradient-to-br from-theme-600 to-theme-900"
      )}
    >
      <div className="ml-8 pb-2">
        <h1 className="text-2xl lg:text-[34px] font-bold text-white">
          {heading}
        </h1>
        <p className="text-white mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
}

interface FormWrapperProps {
  children: React.ReactNode;
  heading: string;
  description: string;
}
