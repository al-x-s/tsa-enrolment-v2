import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

interface SortButtonProps {
  column: any;
  label: string;
}

const SortButton: React.FC<SortButtonProps> = ({ column, label }) => {
  return (
    <Button
      variant="ghost"
      className="px-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

function currencyFilter(options?: { locale?: string; currency?: string }) {
  const locale = options?.locale || "en-US";
  const currency = options?.currency || "USD";

  return (row: any, columnId: string, filterValue: string) => {
    const amount = parseFloat(row.getValue(columnId));
    const filterString = filterValue.replace(/[^0-9.]/g, "");

    if (filterString === "") {
      return true;
    }

    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);

    return (
      formatted.toLowerCase().includes(filterString.toLowerCase()) ||
      amount.toString().includes(filterString)
    );
  };
}

function booleanFilter() {
  return (row: any, columnId: string, filterValue: string) => {
    const value = row.getValue(columnId);
    const filterLower = filterValue.toLowerCase();

    if (filterLower === "") {
      return true; // Show all rows if filter is empty
    }

    const yesMatch = "yes".startsWith(filterLower);
    const noMatch = "no".startsWith(filterLower);

    if (yesMatch && !noMatch) {
      return value === true;
    } else if (noMatch && !yesMatch) {
      return value === false;
    } else {
      // If the filter matches both or neither, show all rows
      return true;
    }
  };
}

function arrayFilter() {
  return (row: any, columnId: string, filterValue: string) => {
    const programs: any = row.getValue(columnId);
    return programs.some((program: any) =>
      program.program.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  };
}

export { booleanFilter, currencyFilter, arrayFilter, SortButton };
