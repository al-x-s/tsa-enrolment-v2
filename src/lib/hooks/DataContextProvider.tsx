"use client";

import React, { Dispatch, SetStateAction } from "react";

import Provider from "@/components/Provider";

// INITIAL VALUE

interface InitialValue {
  schoolData: SchoolData | null;
  setSchoolData: Dispatch<SetStateAction<SchoolData | null>>;
  instrumentData: InstrumentData | null;
  setInstrumentData: Dispatch<SetStateAction<InstrumentData | null>>;
  allHireableInstruments: InstrumentData[] | null;
  setAllHireableInstruments: Dispatch<SetStateAction<InstrumentData[] | null>>;
}

const initialValue: InitialValue = {
  schoolData: null,
  setSchoolData: (action: SetStateAction<SchoolData | null>) => {},
  instrumentData: null,
  setInstrumentData: (action: SetStateAction<InstrumentData | null>) => {},
  allHireableInstruments: null,
  setAllHireableInstruments: (
    action: SetStateAction<InstrumentData[] | null>
  ) => {},
};

// TYPES
import { SchoolData, InstrumentData } from "../types";
import { FormProvider } from "react-hook-form";

interface DataContextProviderProps {
  children: React.ReactNode;
}

export const DataContext = React.createContext<InitialValue>(initialValue);

const DataContextProvider = ({ children }: DataContextProviderProps) => {
  const [schoolData, setSchoolData] = React.useState<SchoolData | null>(null);
  const [instrumentData, setInstrumentData] =
    React.useState<InstrumentData | null>(null);
  const [allHireableInstruments, setAllHireableInstruments] = React.useState<
    InstrumentData[] | null
  >(null);

  return (
    <DataContext.Provider
      value={{
        schoolData,
        setSchoolData,
        instrumentData,
        setInstrumentData,
        allHireableInstruments,
        setAllHireableInstruments,
      }}
    >
      <Provider>{children}</Provider>
    </DataContext.Provider>
  );
};

export default DataContextProvider;
