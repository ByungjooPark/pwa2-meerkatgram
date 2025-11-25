/**
 * @file app.js
 * @description Entry Point
 * 251117 v1.0.0 park
 */

import express from 'express';
import './configs/env.config.js';
import authRouter from './routes/auth.router.js';
import errorHandler from './app/errors/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import SwaggerParser from 'swagger-parser';
import path from 'path';

const app = express();
app.use(express.json()); // JSON 요청 파싱 처리

// --------------------
// swagger 등록
// --------------------
const swaggerDoc = await SwaggerParser.bundle(path.join(path.resolve(), 'swagger/swagger.yaml')); // swagger yaml bundle
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc)); // swagger ui

// --------------------
// 라우터 정의
// --------------------
app.use('/api/auth', authRouter);

// 에러 핸들러 등록
app.use(errorHandler);

// --------------------
// 해당 Port로 express 실행
// --------------------
app.listen(parseInt(process.env.APP_PORT));