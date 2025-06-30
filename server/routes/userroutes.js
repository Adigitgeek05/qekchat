import express from 'express';
import {checkAuth,login, signup, updateProfile } from '../controllers/userController.js';
import {auth} from '../middleware/auth.js';
import User from '../models/User';


const UserRouter = express.Router();

UserRouter.post("/signup",signup);
UserRouter.post("/login", login);
UserRouter.put("/update-profile",auth,updateProfile);
UserRouter.get("/check-auth",auth,checkAuth);


export default UserRouter;
