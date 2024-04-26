// Types
import { InstrumentOptions, Programs } from "@/lib/types";

export default function filterProgramsByInstrument(
  instrument: string,
  instruments: InstrumentOptions,
  programs: any
) {
  const programType: string = instruments[instrument].program;
  const result: Programs[] = programs.filter(
    (program: any) =>
      program.program.type === programType &&
      program.school_program_status !== "Hidden"
  );
  return result;
}
