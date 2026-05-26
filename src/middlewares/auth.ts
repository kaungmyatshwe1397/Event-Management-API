import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/user";
import { AppDataSource } from "../database/data-source";

// Check Authentication of user
export async function authenticationMiddleware(req:Request,res:Response,next:NextFunction){
    // Get token from request header
    const authorizationToken = (req.headers.authorization)?.split("")[1];
    if(!authorizationToken){
        return res.status(400).json({message:"Token is required..."});
    }
    // Verify this json web token and check user had valid token or not
    const user = jwt.verify(authorizationToken,process.env.JWT_SECRET as string) as User;
    if(!user){
        res.status(401).json({message:"User is not authorized."})
    }

    // Check the user with this valid token still exit in our database by using username
    const checkUserInDatabase = await AppDataSource.getRepository(User).findOne({
        where:{
            username:user.username
        }
    })

    res.locals.user = checkUserInDatabase;
    next();
}


export function authorizationMiddleware(req:Request,res:Response,next:NextFunction){
   const user = res.locals.user;
   if (user.role !== "Admin") {
      return res
        .status(403)
        .json("You are not authorized to access this resource");
    }
    next();
}