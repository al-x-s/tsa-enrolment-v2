// School and Programs Tables

export interface InstrumentOptions {
  [key: string]: {
    category: string;
    program: string;
    status: string;
    enrolled: number;
    cap: number;
  };
}

export interface Option {
  label: string;
  message: string;
  disabled: boolean;
}

export interface InstrumentSelectMap {
  program: string;
  children: Option[];
}

export interface Programs {
  schoolId: number;
  programId: number;
  school_program_status: string;
  program: Program;
}

export interface Program {
  id: number;
  name: string;
  type: string;
  description: string;
  cost: number;
  cost_breakdown: [{ [key: string]: string }];
  whats_included: string[];
  classType: string;
  program_status: string;
  enrol_fee: number;
}

export interface SchoolData {
  id: number;
  name: string;
  facility_hire: number;
  grades: JSON;
  instrument_options: InstrumentOptions;
  programs: Programs[];
  resource_levy: number;
  offers_instrument_rental: Boolean;
}

// Instrument and Accessories Tables

export interface Accessory {
  name: string;
  price: number;
  status: string;
  is_recommended: boolean;
  description_short: string;
  description_long: string;
}

export interface PurchaseOptions {
  brand: string;
  model: any;
  image: any;
  rrp: number;
  sale_price: number;
  status: string;
  features: String[];
}

export interface InstrumentData {
  name: string;
  can_hire: boolean;
  hire_cost: number;
  hire_insurance: number;
  accessories: Accessory[];
  purchase_options: PurchaseOptions[];
}

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
  name: string;
  hire_cost: number;
  hire_insurance: number;
}

// Accessories Page

export interface SelectedAccessory {
  [key: string]: boolean;
}
