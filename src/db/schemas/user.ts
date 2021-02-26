import {Schema, model, Document} from 'mongoose'

export interface User extends Document {
    email:string,
    first_name:string,
    last_name:string,
    avatar:string
}

const schema = new Schema({
    email:{ type:String, unique:true, required:true },
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    avatar:String,
    password:{type:String, required:true}
})

const Users = model<User>('users',schema);
export default Users;