import logger from '@cloud-burger/logger';
import cors from 'cors';
import express, { Router } from 'express';
import { env } from './env';

import { createOrder } from './handlers/create-order';
import { createProduct } from './handlers/create-product';
import { deleteProduct } from './handlers/delete-product';
import { findOrderById } from './handlers/find-order-by-id';
import { findProductsByCategory } from './handlers/find-product-by-category';
import { listOrders } from './handlers/list-orders';
import { updateOrderStatus } from './handlers/update-order-status';
import { updateProduct } from './handlers/update-product';

const app = express();
const PORT = +env.PORT;

const router = Router();

// Product
router.get('/products', findProductsByCategory);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order
router.get('/orders', listOrders);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrderStatus);
router.get('/orders/:id', findOrderById);

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  logger.info({
    message: `App listening on port ${PORT}`,
  });
});
