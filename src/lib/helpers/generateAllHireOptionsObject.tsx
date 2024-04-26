interface InputItem {
  name: string;
  hire_cost: number;
  hire_insurance: number;
}

interface OutputItem {
  hire_cost: number;
  insurance_cost: number;
  instruments: string[];
}

export function generateAllHireOptionsObject(
  inputArray: InputItem[] | null
): OutputItem[] | undefined {
  if (inputArray === null) {
    return;
  }

  const result: OutputItem[] = [];

  // Create a Map to store unique cost combinations
  const costMap = new Map<string, OutputItem>();

  // Iterate over the input array
  for (const item of inputArray) {
    const { name, hire_cost, hire_insurance } = item;
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
