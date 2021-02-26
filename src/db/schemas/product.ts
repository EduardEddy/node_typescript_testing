import {Schema, Document, model } from 'mongoose'
import { User } from './user'

interface Product extends Document {
    name:string;
    year:number;
    price:number|null;
    description:string|null;
    user:ObjectId|User
}

const schema = new Schema({
    name:{type:String,required:true},
    year:{type:Number,required:true},
    price:{type:Number,default:0},
    description:{type:String},
    user:{  
        type:Schema.Types.ObjectId,
        ref:"users"
    }
})

const Products = model('product', schema)

export default Products;