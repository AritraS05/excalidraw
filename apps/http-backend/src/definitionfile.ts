import { Request } from "express";
import jwt from "jsonwebtoken";
export interface jwtPayloadWithUserId extends jwt.JwtPayload{
    userId : string
}
export interface userRequest extends Request{
    userId ?: string;
}