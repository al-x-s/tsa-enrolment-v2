import { z } from "zod";

// const hpbEnum = z.enum(["hire", "purchase", "bring own", ""]);

const hireFieldsOptional = {
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

const hirePaymentOptional = {
  cc_name: z.string().optional(),
  cc_number: z.string().optional(),
  cc_expiry: z.string().optional(),
  cc_cvv: z.string().optional(),
  dd_bank_country: z.string().optional(),
  dd_bank_name: z.string().optional(),
  dd_bank_street_address: z.string().optional(),
  dd_bank_city_suburb: z.string().optional(),
  dd_bank_state: z.string().optional(),
  dd_bank_postcode: z.string().optional(),
  dd_bank_acc_name: z.string().optional(),
  dd_bank_bsb: z.string().optional(),
  dd_bank_acc_number: z.string().optional(),
};

const hireFieldsRequired = {
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
  ...hirePaymentOptional,
};

const purchaseFieldsRequired = {
  purchased_model: z
    .string()
    .min(1, { message: "Please select an instrument" }),
};

const hirePaymentMethod = z.enum(["credit card", "direct debit"]);

const hireSchema = z
  .object({
    hire_purchase_byo: z.literal("hire"),
    ...hireFieldsOptional,
    ...hireFieldsRequired,
    hire_payment_method: hirePaymentMethod,
  })
  .superRefine((data, ctx) => {
    if (data.hire_payment_method === "credit card") {
      if (!data.cc_name) {
        ctx.addIssue({
          path: ["cc_name"],
          message: "Name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      // if (!data.cc_number) {
      //   ctx.addIssue({
      //     path: ["cc_number"],
      //     message: "Credit card number is required",
      //     code: z.ZodIssueCode.custom,
      //   });
      // }
      if (!data.cc_number) {
        ctx.addIssue({
          path: ["cc_number"],
          message: "Credit card number is required",
          code: z.ZodIssueCode.custom,
        });
      } else {
        const ccNumberStripped = data.cc_number.replace(/\s+/g, "");
        const visaMastercardRegex =
          /^4[0-9]{12}(?:[0-9]{3})?$|^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;
        if (!visaMastercardRegex.test(ccNumberStripped)) {
          ctx.addIssue({
            path: ["cc_number"],
            message: "Credit card number must be a valid Visa or Mastercard",
            code: z.ZodIssueCode.custom,
          });
        }
      }
      if (!data.cc_expiry) {
        ctx.addIssue({
          path: ["cc_expiry"],
          message: "Expiry is required",
          code: z.ZodIssueCode.custom,
        });
      } else {
        const [month, year] = data.cc_expiry.split("/").map(Number);
        const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
        const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based

        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          ctx.addIssue({
            path: ["cc_expiry"],
            message: "Expiry date must not be in the past",
            code: z.ZodIssueCode.custom,
          });
        }
      }
      if (!data.cc_cvv) {
        ctx.addIssue({
          path: ["cc_cvv"],
          message: "CVV is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (!/^\d{3}$/.test(data.cc_cvv)) {
        ctx.addIssue({
          path: ["cc_cvv"],
          message: "CVV must be exactly 3 digits",
          code: z.ZodIssueCode.custom,
        });
      }
    } else if (data.hire_payment_method === "direct debit") {
      if (!data.dd_bank_country) {
        ctx.addIssue({
          path: ["dd_bank_country"],
          message: "Country is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_name) {
        ctx.addIssue({
          path: ["dd_bank_name"],
          message: "Bank name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_street_address) {
        ctx.addIssue({
          path: ["dd_bank_street_address"],
          message: "Bank address is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_city_suburb) {
        ctx.addIssue({
          path: ["dd_bank_city_suburb"],
          message: "Bank suburb is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_state) {
        ctx.addIssue({
          path: ["dd_bank_state"],
          message: "State is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_postcode) {
        ctx.addIssue({
          path: ["dd_bank_postcode"],
          message: "Postcode is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_acc_name) {
        ctx.addIssue({
          path: ["dd_bank_acc_name"],
          message: "Account name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_bsb) {
        ctx.addIssue({
          path: ["dd_bank_bsb"],
          message: "BSB is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.dd_bank_acc_number) {
        ctx.addIssue({
          path: ["dd_bank_acc_number"],
          message: "Account number is required",
          code: z.ZodIssueCode.custom,
        });
      }
    } else if (data.hire_payment_method === "") {
      return;
    }
  });

const instrumentOptions = z.union([
  hireSchema,
  z.object({
    hire_purchase_byo: z.literal("purchase"),
    ...hireFieldsOptional,
    ...hirePaymentOptional,
    ...purchaseFieldsRequired,
  }),
  z.object({
    hire_purchase_byo: z.literal("bring own"),
    ...hireFieldsOptional,
    ...hirePaymentOptional,
  }),
  z.object({
    hire_purchase_byo: z.literal(""),
    hire_payment_method: z.literal("credit card"),
    ...hireFieldsOptional,
    ...hirePaymentOptional,
    purchased_model: z
      .string()
      .min(1, { message: "Please select an option to continue" }),
  }),
]);

const paymentMethodEnum = z.enum(["credit card", "direct debit", "invoice"]);

const paymentOptions = z.union([
  z.object({
    payment_method: z.literal(paymentMethodEnum.enum["credit card"]),
    cc_name: z
      .string()
      .min(1, { message: "Name is required" })
      .or(z.literal("")),
    // cc_number: z.string().min(1, { message: "Credit card number is required" }),
    cc_number: z
      .string()
      .min(1, { message: "Credit card number is required" })
      .transform((val) => val.replace(/\s+/g, ""))
      .refine(
        (val) =>
          /^4[0-9]{12}(?:[0-9]{3})?$|^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$|^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/.test(
            val
          ),
        { message: "Credit card number must be a valid Visa or Mastercard" }
      )
      .or(z.literal("")),
    cc_expiry: z
      .string()
      .min(1, { message: "Expiry is required" })
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: "Expiry must be in mm/yy format",
      })
      .refine(
        (val) => {
          const [month, year] = val.split("/").map(Number);
          const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
          const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based

          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          ) {
            return false;
          }
          return true;
        },
        { message: "Expiry date must not be in the past" }
      )
      .or(z.literal("")),
    cc_cvv: z.string().min(1, { message: "CVV is required" }).or(z.literal("")),
    cc_autodebit: z.boolean().optional(),
    use_same_card: z.boolean().optional(),
  }),
  z.object({
    payment_method: z.literal(paymentMethodEnum.enum["invoice"]),
    cc_name: z.string().optional(),
    cc_number: z.string().optional(),
    cc_expiry: z.string().optional(),
    cc_cvv: z.string().optional(),
    cc_autodebit: z.boolean().optional(),
    use_same_card: z.boolean().optional(),
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
  welcome_message: z.string().optional(),
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
