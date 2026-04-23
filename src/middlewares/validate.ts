import { NextFunction, Request, Response } from "express";
import { fieldChecker } from "../core/fieldValidator";
import { ValidationSchema } from "../types/validation";

export function validate(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = fieldChecker(req.body, schema);

    //validate payload from frontend
    if (!result.isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.errors,
      });
    }

    next();
  };
}
