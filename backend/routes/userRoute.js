import * as userController from '../controllers/userController.js';
import express from 'express';

const userRoute = express.Router();

userRoute.get('/',          userController.getAll);
userRoute.post('/register', userController.createAccount);

export default userRoute;
