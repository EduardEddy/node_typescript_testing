import { Application } from 'express';

import {UserCtrl} from '../../controlllers/v1/users-controller';
import { productCtrl } from '../../controlllers/v1/products-controller';

const createRoutesV1 = (app: Application):void => {
    app.get('/api/v1/users', UserCtrl.getUsers);
    app.post('/api/v1/users', UserCtrl.createUser);
    app.get('/api/v1/users/:userId', UserCtrl.getUserById);
    app.post('/api/v1/products', productCtrl.createProduct);
    app.get('/api/v1/products', productCtrl.getProducts);
    app.get('/api/v1/products/:productId', productCtrl.getProductById);
    app.put('/api/v1/products/:productId', productCtrl.updateProduct);
    app.patch('/api/v1/products/:productId', productCtrl.partialUpdateProduct);
    app.delete('/api/v1/products/:productId', productCtrl.deleteProductById);
    /*app.post('/api/v1/products/:productId/notify-client', productsController.updateProductAndNotify); */
};

export default createRoutesV1;