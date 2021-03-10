/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Users,{User} from '../../db/schemas/user'
import Product from '../../db/schemas/product'
import { sendError, validateObjectId } from '../../utils/response_utils'

class UserController 
{
    getUsers = async(req:Request, res:Response):Promise<void> => {
        console.log('entro')
        const user = await Users.find();
        res.send( user )
    }    
    
    getUserById = async (req:Request, res:Response):Promise<void> => {
        try {
            const { userId } = req.params
            validateObjectId(userId)
            const user = await Users.findById(userId)
            if(user){
                res.send(user)
            }else{
                res.status(404).send({})
            }
        } catch (e) {
            sendError(res,e)
        }
    }
    
    createUser = async(req:Request, res:Response):Promise<void> => {
        try {
            console.log(req.body)
            const {email, first_name, last_name, avatar, password} = req.body;
            const hash = await bcrypt.hash(password, 15);
            const newUser = await Users.create({
                email, first_name, last_name, avatar, password:hash
            })
            res.send(newUser)
        } catch (e) {
            sendError(res, e)
        }
    }

    deleteById = async (req:Request, res:Response):Promise<void> => {
        try {
            const {userId} = req.params;
            console.log(userId)
            validateObjectId(userId)
            const user = await Users.findByIdAndDelete(userId)
            if(user){
                await Product.deleteMany({user:user._id})
                res.send('ok')
            }else{
                res.status(404).send({})
            }
        } catch (e) {
            sendError(res, e)
        }
    }

    login = async (req:Request, res:Response):Promise<void> => {
        try {
            const { email, password}=req.body
            const user:User|null = await Users.findOne({email});
            if (!user) {
                throw { code:404, message:'user not found'}
            }

            const isOk:boolean = await bcrypt.compare( password, user.password );
            if(!isOk){
                throw {code:401,mesage:'invalid password'}
            }

            const expiresIn=60*60
            const token = jwt.sign({userId:user._id, email:user.email},process.env.JWT_SECRET!,{
                expiresIn
            })
            res.send({'token':token,expiresIn})
        } catch (e) {
            sendError(res, e)
        }
    }
}

const UserCtrl = new UserController();
export { UserCtrl }