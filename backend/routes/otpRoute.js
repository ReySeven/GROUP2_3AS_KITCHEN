import * as otpController from '../controllers/otpController.js';
import express from 'express';

const otpRoute = express.Router();

otpRoute.post('/send',   otpController.send);
otpRoute.post('/verify', otpController.verify);

export default otpRoute;
