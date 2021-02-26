import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { mongo } from 'mongoose'

import User from '../../db/schemas/user'

const getUsers = async(req:Request, res:Response):Promise<void> => {
    console.log('entro')
    const user = await User.find();
    res.send( user )
}


const getUserById = async (req:Request, res:Response):Promise<void> => {
    const { userId } = req.params
    const user = await User.findById(userId)
    if(user){
        res.send(user)
    }else{
        res.status(404).send({})
    }
}

const createUser = async(req:Request, res:Response):Promise<void> => {
    try {
        console.log(req.body)
        const {email, first_name, last_name, avatar, password} = req.body;
        const hash = await bcrypt.hash(password, 15);
        const newUser = await User.create({
            email, first_name, last_name, avatar, password:hash
        })
        res.send(newUser)
    } catch (e) {
        console.log( e )
        if ( e instanceof mongo.MongoError ) {
            res.status(400).send({code:e.code, message:e.errorLabels});
            return;
        }
        res.status(500).send(e.message)
    }
}

export {
    getUsers, getUserById, createUser
}