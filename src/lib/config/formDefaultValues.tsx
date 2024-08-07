import z from "zod";
import { FormDataSchema } from "@/lib/schemas/schema";

export const formDefaultValues: z.infer<typeof FormDataSchema> = {
  student_school: "",
  agree_tsa_terms: false,
  // STUDENT_DETAILS
  student_details: {
    student_first_name: "",
    student_surname: "",
    instrument: "",
    student_grade: "",
    previous_student: "",
    opportunity_student: "",
    student_medical: "",
  },
  // TUITION_TYPE
  selected_program_id: "",
  // YOUR_DETAILS
  your_details: {
    client_first_name: "",
    client_surname: "",
    client_email: "",
    confirm_client_email: "",
    client_mobile: "",
    client_street_address: "",
    client_city_suburb: "",
    client_state: "",
    client_postcode: "",
  },
  // INSTRUMENT OPTIONS
  instrument_options: {
    // Discriminating key
    hire_purchase_byo: "",
    // Hire options (optional)
    nearest_relative_name: "",
    nearest_relative_phone: "",
    main_earner_name: "",
    main_earner_mobile: "",
    main_earner_employer_name: "",
    main_earner_employer_phone: "",
    agree_rental_terms: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    },
    inst_is_insured: true,
    // Hire-specific fields
    hire_payment_method: "credit card",
    cc_name: "",
    cc_number: "",
    cc_expiry: "",
    cc_cvv: "",
    dd_bank_country: "",
    dd_bank_name: "",
    dd_bank_street_address: "",
    dd_bank_city_suburb: "",
    dd_bank_state: "",
    dd_bank_postcode: "",
    dd_bank_acc_name: "",
    dd_bank_bsb: "",
    dd_bank_acc_number: "",
    // Purchase options (optional)
    purchased_model: "",
  },
  // ACCESSORIES
  accessories: {},
  // SUMMARY PAGE
  payment_options: {
    // Discriminating key
    payment_method: "credit card",
    // CREDIT CARD OPTIONS
    cc_name: "",
    cc_number: "",
    cc_expiry: "",
    cc_cvv: "",
    cc_autodebit: false,
    use_same_card: false,
  },
};
