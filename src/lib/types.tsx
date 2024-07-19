import { Prisma } from "@prisma/client";

export type SchoolProgramWithPrograms = Prisma.SchoolProgramGetPayload<{
  include: {
    program: true;
  };
}>;

export type SchoolGradeWithGrades = Prisma.SchoolGradeGetPayload<{
  include: {
    grade: true;
  };
}>;

export type SchoolInstrumentWithInstrument = Prisma.SchoolInstrumentGetPayload<{
  include: {
    instrument: true;
  };
}>;

export type InstrumentWithRelations = Prisma.InstrumentGetPayload<{
  include: {
    models: true;
    accessories: true;
  };
}>;

// Tuition Type Component
export type CostBreakdown = {
  item?: string;
  price?: string;
};

// Summary Page

export interface UserData {
  selected_program_id: any;
  hire_purchase_byo: string;
  inst_is_insured: boolean | undefined;
  purchased_model: string | undefined;
  accessories: any;
  instrument: string;
}

// Instrument Options Page

export interface HireableInstrumentInput {
  instrument: {
    name: string;
    hire_cost: number | null;
    hire_insurance: number | null;
  };
}

// Accessories Page

export interface SelectedAccessory {
  [key: string]: boolean;
}

// Student Details Page

export type Option = {
  label: string;
  message: string;
  disabled: boolean;
};

export type InstrumentSelectMap = {
  program: string;
  children: Option[];
};

// DB QUERIES

export type DeleteResult = {
  isSuccess: boolean;
  error?: any;
};
