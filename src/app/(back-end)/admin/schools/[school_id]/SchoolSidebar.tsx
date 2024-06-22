"use client";
import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

const SchoolSidebar = ({ ...props }) => {
  const segment = useSelectedLayoutSegment();
  const links = [
    { segmentName: "general", label: "General" },
    { segmentName: "grades", label: "Grades" },
    { segmentName: "instrument_options", label: "Instrument Options" },
  ];

  return (
    <>
      {links.map(({ segmentName, label }) => (
        <Link
          href={`/admin/schools/${props.school_id}/${segmentName}`}
          className={clsx(
            "text-primary",
            "transition-colors duration-300",
            segment === segmentName ? "font-semibold" : ""
          )}
          key={segmentName}
        >
          {label}
        </Link>
      ))}
    </>
  );
};

export default SchoolSidebar;
