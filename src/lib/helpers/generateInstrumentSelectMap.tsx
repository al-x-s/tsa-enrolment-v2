// Types
import {
  Option,
  InstrumentSelectMap,
  SchoolInstrumentWithInstrument,
} from "@/lib/types";

export default function generateInstrumentSelectMap(
  data: SchoolInstrumentWithInstrument[] | undefined
): InstrumentSelectMap[] {
  // Produces an array with each program category available at school
  const programs: string[] = [];
  data?.forEach((item) => {
    const program = item.instrument.program_type;
    if (!programs.includes(program)) {
      programs.push(program);
    }
  });

  const options: InstrumentSelectMap[] = [];

  programs.forEach((program) => {
    const children: Option[] = [];

    // Filter instruments by program category
    const instrumentsByProgram = data?.filter(
      (item) => item.instrument.program_type === program
    );

    // Generate options for each instrument in the program category
    instrumentsByProgram?.forEach((instrument) => {
      // Label, message, and disabled will be keys for each option
      const label = instrument.instrument.name;
      let message = "";
      let disabled = false;

      // Status, enrolled and cap from the instrument object tell us what values to pass to message and disabled
      const { status, enrolled, cap } = instrument;

      // If instrument is available at the school but school has opted to pause enrolments for that instrument it's status is Unavailable. Value is still shown but disabled.
      // If the number of students enrolled has hit the enrolment cap value is also shown, but again is disabled with the message "enrolment full".
      if (status === "Unavailable") {
        message = "unavailable";
        disabled = true;
      } else if (enrolled >= cap && cap !== -1) {
        message = "enrolment full";
        disabled = true;
      }

      const result = { label, message, disabled };

      // Options for this instrument are pushed into the children array
      children.push(result);
    });

    // Children array is pushed into the options array along with the program associated with those options
    options.push({ program, children });
  });

  return options;
}
