/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            session:{
                userId:string;
                email:string;
            };
        }
    }
}

class CheckAuth 
{
    verifyToken = (req:Request, res:Response, next:NextFunction)=>{
        try {
            const {token} = req.headers;
            if(!token){
                throw new Error("missing header token")
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const {userId,email} = jwt.verify(token as string, process.env.JWT_SECRET!) as any;
            req.session = {
                userId, email
            }
            next()
        } catch (e) {
            res.status(401).send(e.message)
        }
    }

    checkIp = (req:Request, res:Response, next:NextFunction)=>{
        console.log("req.hostname",req.hostname)
        next()
    }
}

const checkAuth = new CheckAuth
export {checkAuth}