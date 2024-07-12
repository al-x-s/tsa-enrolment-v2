// Types
import {
  SchoolInstrumentWithInstrument,
  SchoolProgramWithPrograms,
} from "@/lib/types";

export default function filterProgramsByInstrument(
  instrumentData: SchoolInstrumentWithInstrument[],
  programs: SchoolProgramWithPrograms[]
) {
  const programType: string = instrumentData[0].instrument.program_type;
  const result: SchoolProgramWithPrograms[] = programs.filter(
    (item: any) => item.program.type === programType && item.status !== "Hidden"
  );
  return result;
}
