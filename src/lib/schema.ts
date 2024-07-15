import { optional, z } from "zod";

const hpbEnum = z.enum(["hire", "purchase", "bring own", ""]);

const instOptionsInit = z.object({
  // TODO Set a condition on the instrument_options page that if both drivers_license_no and purchase_options fail to display a message asking the user to select an option. If you don't do this it will fail silently, but without this init option you'll have to set a default value to hire, purchase or byo which may cause users to miss the fact that they had a choice at all
  // Disciminating key
  hire_purchase_byo: z.literal(hpbEnum.enum[""]),
  // Hire options (optional)
  drivers_license_no: z
    .string()
    .min(1, { message: "Please select an option to continue" }),
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
  // Purchase options (optional)
  purchased_model: z
    .string()
    .min(1, { message: "Please select an option to continue" }),
});

const hire = z.object({
  // Disciminating key
  hire_purchase_byo: z.literal(hpbEnum.enum.hire),
  // Hire options (required)
  drivers_license_no: z
    .string()
    .min(1, { message: "Please enter your license number" }),
  nearest_relative_name: z
    .string()
    .min(1, { message: "Please enter a relatives name" }),
  nearest_relative_phone: z
    .string()
    .min(1, { message: "Please enter your relatives phone number" }),
  main_earner_name: z
    .string()
    .min(1, { message: "Please enter the main earners name" }),
  main_earner_mobile: z
    .string()
    .min(1, { message: "Mobile number is required" }),
  main_earner_employer_name: z
    .string()
    .min(1, { message: "Employers name is required" }),
  main_earner_employer_phone: z
    .string()
    .min(1, { message: "Employers contact number is required" }),
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
  inst_is_insured: z.boolean().optional(),
  // Purchase options (optional)
  purchased_model: z.string().optional(),
});

const purchase = z.object({
  // Disciminating key
  hire_purchase_byo: z.literal(hpbEnum.enum.purchase),
  // Hire options (optional)
  drivers_license_no: z.string().optional(),
  nearest_relative_name: z.string().optional(),
  nearest_relative_phone: z.string().optional(),
  main_earner_name: z.string().optional(),
  main_earner_mobile: z.string().optional(),
  main_earner_employer_name: z.string().optional(),
  main_earner_employer_phone: z.string().optional(),
  agree_rental_terms: z
    .object({
      1: z.boolean(),
      2: z.boolean(),
      3: z.boolean(),
      4: z.boolean(),
      5: z.boolean(),
      6: z.boolean(),
      7: z.boolean(),
    })
    .optional(),
  inst_is_insured: z.boolean().optional(),
  // Purchase options (required)
  purchased_model: z
    .string()
    .min(1, { message: "Please select an instrument" }),
});

const byo = z.object({
  // Disciminating key
  hire_purchase_byo: z.literal(hpbEnum.enum["bring own"]),
  // Hire options (optional)
  drivers_license_no: z.string().optional(),
  nearest_relative_name: z.string().optional(),
  nearest_relative_phone: z.string().optional(),
  main_earner_name: z.string().optional(),
  main_earner_mobile: z.string().optional(),
  main_earner_employer_name: z.string().optional(),
  main_earner_employer_phone: z.string().optional(),
  agree_rental_terms: z
    .object({
      1: z.boolean(),
      2: z.boolean(),
      3: z.boolean(),
      4: z.boolean(),
      5: z.boolean(),
      6: z.boolean(),
      7: z.boolean(),
    })
    .optional(),
  inst_is_insured: z.boolean().optional(),
  // Purchase options (optional)
  purchased_model: z.string().optional(),
});

const instrument_options = z.discriminatedUnion("hire_purchase_byo", [
  hire,
  purchase,
  byo,
  instOptionsInit,
]);

const paymentMethodEnum = z.enum(["credit card", "direct debit", "invoice"]);

const cc = z.object({
  // Disciminating key
  payment_method: z.literal(paymentMethodEnum.enum["credit card"]),
  // CREDIT CARD OPTIONS
  cc_name: z.string().min(1, { message: "Name is required" }),
  cc_number: z.string().min(1, { message: "Credit card number is required" }),
  cc_expiry: z.string().min(1, { message: "Expiry is required" }),
  cc_ccv: z.string().min(1, { message: "CCV is required" }),
  // DIRECT DEBIT OPTIONS
  bank_name: z.string().optional(),
  bank_street_address: z.string().optional(),
  bank_city_suburb: z.string().optional(),
  bank_state: z.string().optional(),
  bank_postcode: z.string().optional(),
  bank_country: z.string().optional(),
  bank_acc_name: z.string().optional(),
  bank_bsb: z.string().optional(),
  bank_acc_number: z.string().optional(),
});

const dd = z.object({
  // Disciminating key
  payment_method: z.literal(paymentMethodEnum.enum["direct debit"]),
  // CREDIT CARD OPTIONS
  cc_name: z.string().optional(),
  cc_number: z.string().optional(),
  cc_expiry: z.string().optional(),
  cc_ccv: z.string().optional(),
  // DIRECT DEBIT OPTIONS
  bank_country: z.string().min(1, { message: "Country is required" }),
  bank_name: z.string().min(1, { message: "Bank name is required" }),
  bank_street_address: z
    .string()
    .min(1, { message: "Bank address is required" }),
  bank_city_suburb: z.string().min(1, { message: "Bank suburb is required" }),
  bank_state: z.string().min(1, { message: "Name is required" }),
  bank_postcode: z.string().min(1, { message: "Postcode is required" }),
  bank_acc_name: z.string().min(1, { message: "Account name is required" }),
  bank_bsb: z.string().min(1, { message: "BSB is required" }),
  bank_acc_number: z.string().min(1, { message: "Account number is required" }),
});

const inv = z.object({
  // Disciminating key
  payment_method: z.literal(paymentMethodEnum.enum["invoice"]),
  // CREDIT CARD OPTIONS
  cc_name: z.string().optional(),
  cc_number: z.string().optional(),
  cc_expiry: z.string().optional(),
  cc_ccv: z.string().optional(),
  // DIRECT DEBIT OPTIONS
  bank_country: z.string().optional(),
  bank_name: z.string().optional(),
  bank_street_address: z.string().optional(),
  bank_city_suburb: z.string().optional(),
  bank_state: z.string().optional(),
  bank_postcode: z.string().optional(),
  bank_acc_name: z.string().optional(),
  bank_bsb: z.string().optional(),
  bank_acc_number: z.string().optional(),
});

const payment_options = z.discriminatedUnion("payment_method", [cc, dd, inv]);

export const FormDataSchema = z.object({
  // WELCOME
  student_school: z.string().min(1, { message: "Please select a school" }),
  agree_tsa_terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions to continue",
  }),
  // STUDENT_DETAILS
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
  // TODO This is currently an optional field...if TSA is ok with it I may remove it but best to leave it here for now in case they'd like you to implement it
  // TODO inst_other: z.string().optional,
  // TUITION_TYPE
  selected_program_id: z
    .string()
    .min(1, { message: "Please select a tuition type" }),
  // ? YOUR_DETAILS
  your_details: z.object({
    client_first_name: z
      .string()
      .min(1, { message: "Please enter your first name" }),
    client_surname: z.string().min(1, { message: "Please enter your surname" }),
    // TODO There's a description under the email field saying "Band notes are sent via email"

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
    relationship: z.string().min(1, { message: "Please select an option" }),
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
  // INSTRUMENT OPTIONS
  instrument_options: instrument_options,
  // ACCESSORIES
  accessories: z.object({}).optional(),
  // SUMMARY PAGE
  payment_options: payment_options,
  // CONTEXT VARIABLES
  school_id: z.string().optional(),
  program_type: z.enum(["Band", "String", "Keyboard", "Guitar"]),
});

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

// Back End Schemas

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
