import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { getLogger } from "../libs/logger";

// Take zod schema as input of main middleware function
export function validationMiddleware<T extends z.ZodTypeAny>(schema: T) {
  // Use HOF method to run middleware function by using schema object 
  return async function (req: Request, res: Response, next: NextFunction) {
    // Check validation of data inside of request body
    const validation = await schema.safeParseAsync(req.body);
    if (!validation.success) {
      getLogger().warn("Validation is failed...");
      return res.status(400).json({
        error: "validaton-error",
        message: validation.error.issues,
        ref:req.headers["x-correlation-id"]
      });
    }

    // Update request body with this checked data
    req.body = validation.data;
    next();
  };
}
