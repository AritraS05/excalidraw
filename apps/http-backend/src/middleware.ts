import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtPayloadWithUserId } from "./definitionfile";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] ?? ""; //jwt takes string as first param so just fallback into empty string if undefined :)
    const decoded = jwt.verify(token,JWT_SECRET);

    if(decoded){
        //todo : fix type errors :)
        req.userId = (decoded as jwtPayloadWithUserId).userId;
        next();
    }
    else{
        res.status(403).json({
            message: "unauthorized user"
        })
    }
}