import { HireableInstrumentInput } from "../types/types";

interface HireableTableData {
  hire_cost: number | null;
  insurance_cost: number | null;
  instruments: string[];
}

export function generateAllHireOptionsObject(
  inputArray: HireableInstrumentInput[] | null
): HireableTableData[] | undefined {
  if (inputArray === null) {
    return;
  }

  const result: HireableTableData[] = [];

  // Create a Map to store unique cost combinations
  const costMap = new Map<string, HireableTableData>();

  // Iterate over the input array
  for (const item of inputArray) {
    const { name, hire_cost, hire_insurance } = item.instrument;
    const costKey = `${hire_cost},${hire_insurance}`;

    // Check if the cost combination exists in the Map
    if (costMap.has(costKey)) {
      // If it exists, add the instrument name to the existing array
      const existingItem = costMap.get(costKey)!;
      existingItem.instruments.push(name);
    } else {
      // If it doesn't exist, create a new entry in the Map
      costMap.set(costKey, {
        hire_cost,
        insurance_cost: hire_insurance,
        instruments: [name],
      });
    }
  }

  // Convert the Map to an array and return it
  costMap.forEach((value) => result.push(value));

  return result;
}
