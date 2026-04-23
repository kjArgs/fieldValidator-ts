import { ValidationSchema } from "../types/validation";
export declare function fieldChecker(fields: Record<string, any>, schema: ValidationSchema): {
    isValid: boolean;
    errors: Record<string, string>;
};
