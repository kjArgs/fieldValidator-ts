import { ValidationSchema } from "../types/validation";

//create a function
export function fieldChecker(
  fields: Record<string, any>,
  schema: ValidationSchema,
) {
    //initialize errors
  const errors: Record<string, string> = {};

  //loop throughout the schema
  for (const key in schema) {
    const value = fields[key];
    const rules = schema[key];

    //checks for empty inputs
    if (rules.required && (!value || String(value).trim() === "")) {
      errors[key] = `${key} is required`;
      continue;
    }

    //check for input length
    if (rules.minLength && value && String(value).length < rules.minLength) {
      errors[key] = `${key} must be at least ${rules.minLength} characters`;
    }
  }

  //return results
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
