import { Request,Response,NextFunction } from "express";
import { getLogger } from "../logger";

export function errorHandlingMiddleware(err:Error,req:Request,res:Response,next:NextFunction){
 getLogger().error({err},err.message);
 res.status(500).json({
    error: 'INTERNAL ERROR',
    message: err.message,
    ref:req.headers['x-correlation-id']
 })
}



//** One of the express build in is it can select error middleware 
// middleware function with four parameters
// So , it can auto detect this is errorHandling middleware
// For that, we need to use all three parameter of express req,res,next + error room
// But never call or dont need to call next function. */