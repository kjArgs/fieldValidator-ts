export type FieldRule = {
    required?: boolean;
    minLength?: number;
};
export type ValidationSchema = Record<string, FieldRule>;
