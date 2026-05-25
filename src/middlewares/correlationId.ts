import { Request,Response,NextFunction } from "express";
import { v4 as uuid } from "uuid";
import { asyncStorage } from "../logger";

export function correlationIdMiddleware(req:Request,res:Response,next:NextFunction){
    // Check user had existing correlation ID 
    const existingCorrelationId = req.headers['x-correlation-id']as string;
    // If user had oldId use it  or  if not have one, creat correaltion id by using uuid 
    const correlationId = existingCorrelationId || uuid();

    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('X-Correlation-ID',correlationId);

    // Keep this correlation id inside this asyncstroge
    asyncStorage.run({correlationId},()=>next());
}