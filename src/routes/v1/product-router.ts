import { Router } from 'express'
import { productCtrl } from '../../controlllers/v1/products-controller';
import {checkAuth} from '../../middleware/auth_middleware'
import { validateNewProductBody, validateDelete, validateProductAndNotify } from '../../validator/v1/products-validator';

import { handleRequestErrors } from '../../middleware/validator-middleware';
const router = Router();

router.post('', checkAuth.verifyToken, validateNewProductBody, handleRequestErrors, productCtrl.createProduct);
router.get('', checkAuth.checkIp, checkAuth.verifyToken, productCtrl.getProducts);
router.get('/:productId', checkAuth.verifyToken, productCtrl.getProductById);
router.put('/:productId', checkAuth.verifyToken, productCtrl.updateProduct);
router.patch('/:productId', checkAuth.verifyToken, productCtrl.partialUpdateProduct);

router.delete('/:productId', checkAuth.verifyToken, validateDelete, handleRequestErrors, productCtrl.deleteProductById);

router.post('/:productId/notify-client', checkAuth.verifyToken, validateProductAndNotify, handleRequestErrors, productCtrl.updateProductAndNotify); 

export default router;