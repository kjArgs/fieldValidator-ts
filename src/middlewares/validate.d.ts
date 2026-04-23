import { NextFunction, Request, Response } from "express";
import { ValidationSchema } from "../types/validation";
export declare function validate(schema: ValidationSchema): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
