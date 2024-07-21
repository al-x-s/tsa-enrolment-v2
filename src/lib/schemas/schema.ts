import { optional, z } from "zod";

const hpbEnum = z.enum(["hire", "purchase", "bring own", ""]);

const commonFields = {
  nearest_relative_name: z.string().optional(),
  nearest_relative_phone: z.string().optional(),
  main_earner_name: z.string().optional(),
  main_earner_mobile: z.string().optional(),
  main_earner_employer_name: z.string().optional(),
  main_earner_employer_phone: z.string().optional(),
  agree_rental_terms: z
    .object({
      1: z.boolean().optional(),
      2: z.boolean().optional(),
      3: z.boolean().optional(),
      4: z.boolean().optional(),
      5: z.boolean().optional(),
      6: z.boolean().optional(),
      7: z.boolean().optional(),
    })
    .optional(),
  inst_is_insured: z.boolean().optional(),
  purchased_model: z.string().optional(),
};

const hireFields = {
  nearest_relative_name: z
    .string()
    .min(1, { message: "Please enter a relative's name" }),
  nearest_relative_phone: z
    .string()
    .min(1, { message: "Please enter your relative's phone number" }),
  main_earner_name: z
    .string()
    .min(1, { message: "Please enter the main earner's name" }),
  main_earner_mobile: z
    .string()
    .min(1, { message: "Mobile number is required" }),
  main_earner_employer_name: z
    .string()
    .min(1, { message: "Employer's name is required" }),
  main_earner_employer_phone: z
    .string()
    .min(1, { message: "Employer's contact number is required" }),
  agree_rental_terms: z.object({
    1: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    2: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    3: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    4: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    5: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    6: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
    7: z.boolean().refine((val) => val === true, {
      message: "You must agree to all terms",
    }),
  }),
};

const purchaseFields = {
  purchased_model: z
    .string()
    .min(1, { message: "Please select an instrument" }),
};

const instrumentOptions = z.union([
  z.object({
    hire_purchase_byo: z.literal(hpbEnum.enum.hire),
    ...commonFields,
    ...hireFields,
  }),
  z.object({
    hire_purchase_byo: z.literal(hpbEnum.enum.purchase),
    ...commonFields,
    ...purchaseFields,
  }),
  z.object({
    hire_purchase_byo: z.literal(hpbEnum.enum["bring own"]),
    ...commonFields,
  }),
  z.object({
    hire_purchase_byo: z.literal(hpbEnum.enum[""]),
    ...commonFields,
    purchased_model: z
      .string()
      .min(1, { message: "Please select an option to continue" }),
  }),
]);

const paymentMethodEnum = z.enum(["credit card", "direct debit", "invoice"]);

const paymentOptions = z.union([
  z.object({
    payment_method: z.literal(paymentMethodEnum.enum["credit card"]),
    cc_name: z.string().min(1, { message: "Name is required" }),
    cc_number: z.string().min(1, { message: "Credit card number is required" }),
    cc_expiry: z.string().min(1, { message: "Expiry is required" }),
    cc_ccv: z.string().min(1, { message: "CCV is required" }),
    bank_country: z.string().optional(),
    bank_name: z.string().optional(),
    bank_street_address: z.string().optional(),
    bank_city_suburb: z.string().optional(),
    bank_state: z.string().optional(),
    bank_postcode: z.string().optional(),
    bank_acc_name: z.string().optional(),
    bank_bsb: z.string().optional(),
    bank_acc_number: z.string().optional(),
  }),
  z.object({
    payment_method: z.literal(paymentMethodEnum.enum["direct debit"]),
    bank_country: z.string().min(1, { message: "Country is required" }),
    bank_name: z.string().min(1, { message: "Bank name is required" }),
    bank_street_address: z
      .string()
      .min(1, { message: "Bank address is required" }),
    bank_city_suburb: z.string().min(1, { message: "Bank suburb is required" }),
    bank_state: z.string().min(1, { message: "State is required" }),
    bank_postcode: z.string().min(1, { message: "Postcode is required" }),
    bank_acc_name: z.string().min(1, { message: "Account name is required" }),
    bank_bsb: z.string().min(1, { message: "BSB is required" }),
    bank_acc_number: z
      .string()
      .min(1, { message: "Account number is required" }),
  }),
  z.object({
    payment_method: z.literal(paymentMethodEnum.enum["invoice"]),
  }),
]);

export const FormDataSchema = z.object({
  student_school: z.string().min(1, { message: "Please select a school" }),
  agree_tsa_terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions to continue",
  }),
  student_details: z.object({
    student_first_name: z
      .string()
      .min(1, { message: "First name is required" }),
    student_surname: z.string().min(1, "Surname is required"),
    instrument: z.string().min(1, "Please select your instrument"),
    student_grade: z
      .string()
      .min(1, { message: "Please select a grade to continue" }),
    previous_student: z.string().min(1, { message: "Please select an option" }),
    opportunity_student: z
      .string()
      .min(1, { message: "Please select an option" }),
    student_medical: z.string().max(1000).optional(),
  }),
  selected_program_id: z
    .string()
    .min(1, { message: "Please select a tuition type" }),
  your_details: z.object({
    client_first_name: z
      .string()
      .min(1, { message: "Please enter your first name" }),
    client_surname: z.string().min(1, { message: "Please enter your surname" }),
    client_email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email address" }),
    confirm_client_email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email address" }),
    client_mobile: z
      .string()
      .min(1, { message: "A mobile number is required" }),
    client_street_address: z
      .string()
      .min(1, { message: "Please provide an address" }),
    client_city_suburb: z
      .string()
      .min(1, { message: "Please provide a suburb" }),
    client_state: z.string().min(1, { message: "Please select a state" }),
    client_postcode: z
      .string()
      .min(1, { message: "Please enter your postcode" }),
  }),
  instrument_options: instrumentOptions,
  accessories: z.record(z.boolean()).optional(),
  payment_options: paymentOptions,
});

// Back End Schemas

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(45, "Password must be less than 45 characters"),
  otp: z.string().optional(),
});

export const schoolSchema = z.object({
  name: z.string().min(1, "School name must contain at least 1 character"),
  state_territory: z.enum([
    "ACT",
    "NSW",
    "NT",
    "QLD",
    "SA",
    "TAS",
    "VIC",
    "WA",
  ]),
  facility_hire: z.number(),
  resource_levy: z.number(),
  offers_instrument_rental: z.boolean(),
});

export const programSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["Band", "String", "Keyboard", "Guitar"]),
  classType: z.enum(["Group", "Private", "Rehearsal"]),
  tuition_fee: z.number(),
  rehearsal_fee: z.number(),
  enrol_fee: z.number(),
  program_status: z.enum(["Active", "Inactive"]),
});

export const gradeSchema = z.object({
  name: z.string().min(1, "Grade name must contain at least 1 character"),
  category: z.enum(["Pre", "Primary", "Secondary", "Tertiary"]),
  order: z.number(),
  state_territory: z.enum([
    "ACT",
    "NSW",
    "NT",
    "QLD",
    "SA",
    "TAS",
    "VIC",
    "WA",
  ]),
});

export const instrumentSchema = z.object({
  name: z.string().min(1, "Grade name must contain at least 1 character"),
  program_type: z.enum(["Band", "String", "Guitar", "Keyboard"]),
  can_hire: z.boolean(),
  hire_cost: z.number(),
  hire_insurance: z.number(),
});

export const schoolInstrumentSchema = z.object({
  enrolled: z.number(),
  cap: z.number(),
  status: z.enum(["Available", "Unavailable", "Hidden"]),
});

export const modelSchema = z.object({
  model: z.string().min(1, "Model name must contain at least 1 character"),
  brand: z.string().min(1, "Brand name must contain at least 1 character"),
  image: z.string(),
  status: z.enum(["Available", "Sold_Out"]),
  rrp: z.number(),
  sale_price: z.number(),
});

export const accessorySchema = z.object({
  name: z.string().min(1, "Name must contain at least 1 character"),
  status: z.enum(["Active", "Inactive"]),
  price: z.number(),
  is_recommended: z.boolean(),
  description_short: z
    .string()
    .min(1, "Short description must contain at least 1 character"),
  description_long: z
    .string()
    .min(1, "Long description must contain at least 1 character"),
});

export const userSchema = z.object({
  username: z.string().min(1, "Name must contain at least 1 character"),
  email: z.string().email(),
  role: z.string(),
});
