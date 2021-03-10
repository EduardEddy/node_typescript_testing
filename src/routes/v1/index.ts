import { Application } from 'express';

import userRoter from './user-router'
import productRouter from './product-router'

const createRoutesV1 = (app: Application):void => {
    app.use('/api/v1/users',userRoter);
    app.use('/api/v1/products',productRouter);
};

export default createRoutesV1;