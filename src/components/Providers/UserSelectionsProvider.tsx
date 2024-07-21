import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import getSchoolData from "@/lib/server_actions/front_end/getSchoolData";
import getInstrumentData from "@/lib/server_actions/front_end/getInstrumentData";
import { Model, Accessory, Instrument, Program } from "@prisma/client";
import {
  HireableTableData,
  SchoolDataResult,
  SchoolProgramWithPrograms,
} from "@/lib/types/types";
import getProgramsData from "@/lib/server_actions/front_end/getProgramsData";
import getHireableTableData from "@/lib/server_actions/front_end/getHireableTableData";
import useAppFormContext from "@/lib/hooks/useAppFormContext";

interface UserSelectionsContextType {
  // ? TRIGGER - school_name
  // ! FETCHES - selectedSchoolData
  selectedSchoolData: SchoolDataResult;
  setSelectedSchoolData: React.Dispatch<React.SetStateAction<SchoolDataResult>>;
  // ? TRIGGER - instrument
  // ! FETCHES - selectedInstrumentData
  selectedInstrumentData: Instrument;
  setSelectedInstrumentData: React.Dispatch<React.SetStateAction<Instrument>>;
  // ! FETCHES - availableModels
  availableModels: Model[];
  setAvailableModels: React.Dispatch<React.SetStateAction<Model[]>>;
  // ! FETCHES - availableAccessories
  availableAccessories: Accessory[];
  setAvailableAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>;
  // ! FETCHES - availablePrograms
  availablePrograms: SchoolProgramWithPrograms[];
  setAvailablePrograms: React.Dispatch<
    React.SetStateAction<SchoolProgramWithPrograms[]>
  >;
  // ! FETCHES - hireableTableData
  hireableTableData: HireableTableData[];
  setHireableTableData: React.Dispatch<
    React.SetStateAction<HireableTableData[]>
  >;
  // ? TRIGGER selected_program_id
  // ! FETCHES - selectedProgramData
  selectedProgramData: Program;
  setSelectedProgramData: React.Dispatch<React.SetStateAction<Program>>;
  // ? TRIGGER accessories
  // ! FETCHES - selectedAccessoriesData
  selectedAccessoriesData: Accessory[];
  setSelectedAccessoriesData: React.Dispatch<React.SetStateAction<Accessory[]>>;
  // ? TRIGGER purchased_model
  // ! FETCHES - selectedModelData
  selectedModelData: Model;
  setSelectedModelData: React.Dispatch<React.SetStateAction<Model>>;
}

const defaultUserSelections: UserSelectionsContextType = {
  selectedSchoolData: {
    grades: [],
    instruments: [],
    enrolmentYear: 0,
    schoolId: 0,
    levyFee: 0,
  },
  setSelectedSchoolData: () => {},
  selectedInstrumentData: {
    id: 0,
    name: "",
    program_type: "Band",
    can_hire: false,
    hire_cost: 0,
    hire_insurance: 0,
  },
  setSelectedInstrumentData: () => {},
  availableModels: [
    {
      id: 0,
      brand: "Loading",
      image: "instrument_placeholder_gtt7km",
      model: "Loading",
      rrp: 0,
      sale_price: 0,
      status: "Available",
    },
  ],
  setAvailableModels: () => {},
  availableAccessories: [
    {
      id: 0,
      description_long: "Loading",
      description_short: "Loading",
      is_recommended: true,
      name: "Loading",
      price: 0,
      status: "Active",
    },
  ],
  setAvailableAccessories: () => {},
  availablePrograms: [],
  setAvailablePrograms: () => {},
  hireableTableData: [
    {
      hire_cost: 0,
      insurance_cost: 0,
      instruments: [],
    },
  ],
  setHireableTableData: () => {},

  selectedProgramData: {
    id: 0,
    name: "",
    description: "",
    type: "Band",
    classType: "Group",
    program_status: "Active",
    tuition_fee: 0,
    rehearsal_fee: 0,
    enrol_fee: 0,
  },
  setSelectedProgramData: () => {},
  selectedAccessoriesData: [],
  setSelectedAccessoriesData: () => {},
  selectedModelData: {
    id: 0,
    brand: "Loading",
    image: "instrument_placeholder_gtt7km",
    model: "Loading",
    rrp: 0,
    sale_price: 0,
    status: "Available",
  },
  setSelectedModelData: () => {},
};

const UserSelectionsContext = createContext<UserSelectionsContextType>(
  defaultUserSelections
);

export const UserSelectionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { watch } = useAppFormContext();
  const {
    student_school,
    student_details,
    selected_program_id,
    instrument_options,
    accessories,
  } = watch();
  const { instrument } = student_details;
  const { purchased_model } = instrument_options;

  const [selectedSchoolData, setSelectedSchoolData] =
    useState<SchoolDataResult>(defaultUserSelections.selectedSchoolData);
  const [selectedInstrumentData, setSelectedInstrumentData] =
    useState<Instrument>(defaultUserSelections.selectedInstrumentData);
  const [availableModels, setAvailableModels] = useState<Model[]>(
    defaultUserSelections.availableModels
  );
  const [availableAccessories, setAvailableAccessories] = useState<Accessory[]>(
    defaultUserSelections.availableAccessories
  );
  const [availablePrograms, setAvailablePrograms] = useState<
    SchoolProgramWithPrograms[]
  >(defaultUserSelections.availablePrograms);
  const [hireableTableData, setHireableTableData] = useState<
    HireableTableData[]
  >(defaultUserSelections.hireableTableData);
  const [selectedProgramData, setSelectedProgramData] = useState<Program>(
    defaultUserSelections.selectedProgramData
  );

  const [selectedAccessoriesData, setSelectedAccessoriesData] = useState<
    Accessory[]
  >(defaultUserSelections.selectedAccessoriesData);
  const [selectedModelData, setSelectedModelData] = useState<Model>(
    defaultUserSelections.selectedModelData
  );

  const value = useMemo(
    () => ({
      selectedSchoolData,
      setSelectedSchoolData,
      selectedInstrumentData,
      setSelectedInstrumentData,
      availableModels,
      setAvailableModels,
      availableAccessories,
      setAvailableAccessories,
      availablePrograms,
      setAvailablePrograms,
      hireableTableData,
      setHireableTableData,
      selectedProgramData,
      setSelectedProgramData,
      selectedAccessoriesData,
      setSelectedAccessoriesData,
      selectedModelData,
      setSelectedModelData,
    }),
    [
      selectedSchoolData,
      selectedInstrumentData,
      availableModels,
      availableAccessories,
      availablePrograms,
      hireableTableData,
      selectedProgramData,
      selectedAccessoriesData,
      selectedModelData,
    ]
  );

  // The queries below are prefetching data when target values are selected by the user
  // school_name -> schoolData
  const { data: schoolData } = useQuery({
    queryKey: ["schoolData", student_school],
    queryFn: () => getSchoolData(student_school),
    enabled: !!student_school,
  });

  React.useEffect(() => {
    if (schoolData) {
      setSelectedSchoolData(schoolData);
    }
  }, [schoolData]);

  // instrument -> instrumentData, availableModels, availableAccessories, availablePrograms, hireableTableData
  const { data: instrumentData } = useQuery({
    queryKey: ["instrumentData", instrument],
    queryFn: () => getInstrumentData(instrument),
    enabled: !!instrument,
  });

  React.useEffect(() => {
    if (instrumentData) {
      setSelectedInstrumentData(instrumentData.instrumentData);
      setAvailableModels(instrumentData.models);
      setAvailableAccessories(instrumentData.accessories);
    }
  }, [instrument, instrumentData]);

  const { data: programsData } = useQuery({
    queryKey: [
      "programsData",
      selectedSchoolData.schoolId,
      selectedInstrumentData.program_type,
    ],
    queryFn: () =>
      getProgramsData(
        selectedSchoolData.schoolId,
        selectedInstrumentData.program_type
      ),
    enabled:
      !!selectedSchoolData.schoolId && !!selectedInstrumentData.program_type,
  });

  React.useEffect(() => {
    if (programsData) {
      setAvailablePrograms(programsData);
    }
  }, [programsData]);

  const { data: hireableTableDataFetch } = useQuery({
    queryKey: [
      "hireableTableData",
      selectedSchoolData.schoolId,
      selectedInstrumentData.program_type,
    ],
    queryFn: () =>
      getHireableTableData(
        selectedSchoolData.schoolId,
        selectedInstrumentData.program_type
      ),
    enabled:
      !!selectedSchoolData.schoolId && !!selectedInstrumentData.program_type,
  });

  React.useEffect(() => {
    if (hireableTableDataFetch) {
      setHireableTableData(hireableTableDataFetch);
    }
  }, [hireableTableDataFetch]);

  // SELECTED PROGRAM ID -> selectedProgram

  React.useEffect(() => {
    if (selected_program_id) {
      const result = availablePrograms?.filter(
        (program: any) => program.programId === parseInt(selected_program_id)
      );
      setSelectedProgramData(result[0].program);
    }
  }, [selected_program_id]);

  // SELECTED MODEL NAME -> selectedModelData
  React.useEffect(() => {
    if (purchased_model) {
      const result = availableModels?.filter(
        (model) => model.model === purchased_model
      );
      setSelectedModelData(result[0]);
    }
  }, [purchased_model]);

  // SELECTED ACCESSORIES -> selectedAccessoriesData

  React.useEffect(() => {
    const result = availableAccessories?.filter(
      (accessory) => accessories?.[accessory.name]
    );
    setSelectedAccessoriesData(result);
  }, [accessories]);

  return (
    <UserSelectionsContext.Provider value={value}>
      {children}
    </UserSelectionsContext.Provider>
  );
};

export const useUserSelections = () => {
  const context = useContext(UserSelectionsContext);
  if (!context) {
    throw new Error(
      "useUserSelections must be used within a UserSelectionsProvider"
    );
  }
  return context;
};
