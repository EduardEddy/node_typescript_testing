import { Router, Request, Response, NextFunction } from 'express'
import { productCtrl } from '../../controlllers/v1/products-controller';
import {checkAuth} from '../../middleware/auth_middleware'
import { validateNewProductBody } from '../../validator/v1/products-validator';
import { validationResult } from 'express-validator'
const router = Router();

router.post('', checkAuth.checkIp, checkAuth.verifyToken, validateNewProductBody,
    (req:Request,res:Response,next:NextFunction)=>{
        const errors = validationResult(req)
        if( errors.isEmpty() ){
            next()
        }else{
            res.status(400).send(errors.array())
        }
    }, productCtrl.createProduct);
router.get('', checkAuth.checkIp, checkAuth.verifyToken, productCtrl.getProducts);
router.get('/:productId', checkAuth.verifyToken, productCtrl.getProductById);
router.put('/:productId', checkAuth.verifyToken, productCtrl.updateProduct);
router.patch('/:productId', checkAuth.verifyToken, productCtrl.partialUpdateProduct);
router.delete('/:productId', checkAuth.verifyToken, productCtrl.deleteProductById);
router.post('/:productId/notify-client', checkAuth.verifyToken, productCtrl.updateProductAndNotify); 

export default router;