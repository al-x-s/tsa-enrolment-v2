// Types
import { Option, InstrumentSelectMap, InstrumentOptions } from "@/lib/types";

export default function generateInstrumentSelectMap(
  schoolInstruments: InstrumentOptions
): InstrumentSelectMap[] {
  const instruments = Object.keys(schoolInstruments).sort();

  // Produces an array with each program category available at school
  const instrumentPrograms: string[] = [];
  instruments.forEach((inst) => {
    const program = schoolInstruments[inst].program;
    if (!instrumentPrograms.includes(program)) {
      instrumentPrograms.push(program);
    }
  });

  const options: InstrumentSelectMap[] = [];

  // Iterate over program category
  instrumentPrograms.forEach((program) => {
    const children: Option[] = [];

    // Filter instruments by program category
    const instrumentsByProgram = instruments.filter(
      (instrument) => schoolInstruments[instrument].program === program
    );

    // Generate options for each instrument in the program category
    instrumentsByProgram.forEach((instrument) => {
      // Label, message, and disabled will be keys for each option
      const label = instrument;
      let message = "";
      let disabled = false;

      // Status, enrolled and cap from the schoolInstruments object tell us what values to pass to message and disabled
      const { status, enrolled, cap } = schoolInstruments[instrument];

      // If instrument is not available at school it's status will be Hidden
      if (status === "Hidden") {
        return;
      }

      // If instrument is available at the school but school has opted to pause enrolments for that instrument it's status is Inactive. Value is still shown but disabled.
      // If the number of students enrolled has hit the enrolment cap value is also shown, but again is disabled with the message "enrolment full".
      if (status === "Inactive") {
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
