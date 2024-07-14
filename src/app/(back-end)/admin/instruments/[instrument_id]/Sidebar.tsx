"use client";
import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

const Sidebar = ({ ...props }) => {
  const segment = useSelectedLayoutSegment();

  return (
    <>
      {props.links.map(
        ({ segmentName, label }: { segmentName: string; label: string }) => (
          <Link
            href={`/admin/instruments/${props.id}/${segmentName}`}
            className={clsx(
              "text-primary",
              "transition-colors duration-300",
              segment === segmentName ? "font-semibold" : ""
            )}
            key={segmentName}
          >
            {label}
          </Link>
        )
      )}
    </>
  );
};

export default Sidebar;
