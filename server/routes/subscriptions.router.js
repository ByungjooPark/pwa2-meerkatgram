/**
 * @file routes/subscriptions.router.js
 * @description subscriptions 관련 라우터
 * 251203 v1.0.0 park init
 */

import express from 'express';
import subscriptionsController from '../app/controllers/subscriptions.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';

const subscriptionsRouter = express.Router();

subscriptionsRouter.post('/', authMiddleware, subscriptionsController.subscribe);

export default subscriptionsRouter;