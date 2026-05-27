import { Request, Response, NextFunction } from "express";
import { getLogger } from "../libs/logger";
import { AppError } from "../libs/errorClasses";

export function errorHandlingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log error meesage
  getLogger().error({ err }, err.message);

  // If error is from one of our error class show its explicit status code and error code and message
 if(err instanceof AppError){
  return res.status(err.statusCode).json({
    error:err.code,
    message: err.message,
    ref: req.headers["x-correlation-id"]
  })
 }

 // If not , defautl internal error return
 return res.status(500).json({
    error: "INTERNAL_ERROR",
    message: err.message,
    ref: req.headers["x-correlation-id"],
  });
}



//** One of the express build in is it can select error middleware
// middleware function with four parameters
// So , it can auto detect this is errorHandling middleware
// For that, we need to use all three parameter of express req,res,next + error room
// But never call or dont need to call next function. */
