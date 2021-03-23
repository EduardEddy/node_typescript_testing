import { Request, Response} from 'express';
import Products from '../../db/schemas/product'
import { Types } from 'mongoose'
import {sendError, validateObjectId} from '../../utils/response_utils';

class ProductController{

    getProducts = async (req:Request, res:Response):Promise<void> => {
        
        const itemsPerPage:number = 3;
        const page = parseInt(req.query.page as string);
        const start = (page - 1) * itemsPerPage;
        const total = await Products.count({user:req.session.userId});
    
        const products = await Products.find({
            user:req.session.userId
        }).skip(start).limit(itemsPerPage).populate({
            path:'user',
            select:{ password:0 }
        })
    
        res.send({
            "page": page,
            "per_page": itemsPerPage,
            "total": total,
            "total_pages": Math.ceil(total / itemsPerPage),
            "data": products,
        })
    }
    
    
    getProductById = async (req:Request, res:Response):Promise<void> => {
        try {
            const { productId } = req.params
            validateObjectId(productId)
            const product = await Products.findOne({
                _id:productId,
                user:req.session.userId
            }).populate({
                path:'user',
                select:{ password:0 }
            });
            if ( product ) {
                res.send({ data: product })
            } else {
                res.status(404).send({})
            }
            
        } catch (e) {
            sendError(res,e)
        }
    }
    
    createProduct = async (req:Request, res:Response):Promise<void> => {
        try {
            console.log( req.session )
            const { userId } = req.session
            const { name, year, price, description } = req.body;
            validateObjectId(userId)
            const product = await Products.create({
                name, year, price, description, user:userId
            })
            res.send(product)
            
        } catch (e) {
            sendError(res,e)
        }
    }
    
    
    updateProduct = async (req:Request, res:Response):Promise<void> => {
        try {
            const id:string = req.params.productId;
            validateObjectId(id)
            const { name, year, price, description } = req.body;
            const product = await Products.findOneAndUpdate({_id:id,user:req.session.userId},{
                name, year, price, description, user:req.session.userId
            })
        
            if (product) {
                res.send({ data: product })
            } else {
                res.status(404).send({})
            }
            
        } catch (e) {
            sendError(res,e)
        }
    }
    
    partialUpdateProduct = async (req:Request, res:Response):Promise<void> => {
        try {
            const productId:string = req.params.productId;
            validateObjectId(productId)
            const { name, year, price, description } = req.body;
            const product = await Products.findOne({_id:productId,user:req.session.userId})
        
            if (product) {
                product.name = name||product.name
                product.year = year||product.year
                product.price = price||product.price
                product.description = description||product.description
                product.save()
        
                res.send({ data: product })
            } else {
                res.status(404).send({})
            }
        } catch (error) {
            sendError(res,error)
        }
    }
    
    updateProductAndNotify = async (req:Request, res:Response):Promise<void> => {
        try {
            const productId:string = req.params.productId;
            validateObjectId( productId )
            const { client, data } = req.body
            const { name, year, description, price} = data;
            const product = await Products.findOne({_id_:productId,user:req.session.userId});
            if (product) {
                product.name = name||product.name
                product.year = year||product.year
                product.price = price||product.price
                product.description = description||product.description
                product.save()
        
                res.send({ data: product, message:`Email sent to ${client}` })
            } else {
                res.status(404).send({})
            }
        } catch (e) {
            sendError(res, e)
        }
    }
    
    
    deleteProductById = async (req:Request, res:Response):Promise<void>  => {
        try {
            const productId: string = req.params.productId;
            //validateObjectId(productId)
            const product = await Products.deleteOne({_id:productId, user:req.session.userId})
            if ( product.deletedCount && product.deletedCount > 0 ) {
                res.send({})
            } else {
                res.status(404).send({})
            }
            
        } catch (e) {
            sendError(res,e)
        }
    }
}

const productCtrl = new ProductController();
export {productCtrl}