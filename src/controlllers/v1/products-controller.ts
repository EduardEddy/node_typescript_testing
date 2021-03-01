import { Request, Response} from 'express';
import Products from '../../db/schemas/product'
import { Types } from 'mongoose'

class ProductController{

    getProducts = async (req:Request, res:Response):Promise<void> => {
        const itemsPerPage:number = 3;
        const page = parseInt(req.query.page as string);
        const start = (page - 1) * itemsPerPage;
        const total = await Products.count();
    
        const products = await Products.find().skip(start).limit(itemsPerPage)
    
        res.send({
            "page": page,
            "per_page": itemsPerPage,
            "total": total,
            "total_pages": Math.ceil(total / itemsPerPage),
            "data": products,
        })
    }
    
    
    getProductById = async (req:Request, res:Response):Promise<void> => {
        const { productId } = req.params
        const product = await Products.findById(productId);
        if ( product ) {
            res.send({ data: product })
        } else {
            res.status(404).send({})
        }
    }
    
    createProduct = async (req:Request, res:Response):Promise<void> => {
        const { name, year, price, description, user } = req.body;
        const product = await Products.create({
            name, year, price, description, user
        })
        res.send(product)
    }
    
    
    updateProduct = async (req:Request, res:Response):Promise<void> => {
        const id:string = req.params.productId;
        const { name, year, price, description, user } = req.body;
        const product = await Products.findByIdAndUpdate(id,{
            name, year, price, description, user
        })
    
        if (product) {
            res.send({ data: product })
        } else {
            res.status(404).send({})
        }
    }
    
    partialUpdateProduct = async (req:Request, res:Response):Promise<void> => {
        const productId:string = req.params.productId;
        const { name, year, price, description, user } = req.body;
        const product = await Products.findById(productId)
    
        if (product) {
            product.name = name||product.name
            product.year = year||product.year
            product.price = price||product.price
            product.user = user||product.user
            product.description = description||product.description
            product.save()
    
            res.send({ data: product })
        } else {
            res.status(404).send({})
        }
    }
    
    /*
    const updateProductAndNotify = (req:Request, res:Response):void => {
        const productId = parseInt(req.params.productId);
        const { client, data } = req.body
        const { id, name, year, color, pantone_value }: Product = data;
        const index = products.findIndex((item) => item.id === productId);
        if (index !== -1) {
    
            const product = products[index];
    
            products[index] = {
                id: id || product.id,
                name: name || product.name,
                year: year || product.year,
                color: color || product.color,
                pantone_value: pantone_value || product.pantone_value,
            }
            res.send({ data: products[index], message: `Email sent to ${client}` })
        } else {
            res.status(404).send({})
        }
    }*/
    
    
    deleteProductById = async (req:Request, res:Response):Promise<void>  => {
        const productId: string = req.params.productId;
        const product = await Products.deleteOne({_id:Types.ObjectId( productId)})
        console.log( product )
        if ( product.deletedCount && product.deletedCount > 0 ) {
            res.send({})
        } else {
            res.status(404).send({})
        }
    }
}

const productCtrl = new ProductController();
export {productCtrl}  
/*export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    partialUpdateProduct,
}*/