import { Request,Response,NextFunction } from "express";

export function authenticationMiddleware(req:Request,res:Response,next:NextFunction){
    /**Later add this with JWT and password hashing. */
}