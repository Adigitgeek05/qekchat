import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwt_verify } from '../lib/utils.js';


// Middleware to protect routes
export const auth= async (req,res,next) => {
    try{
    const token = req.headers.token;

    const decoded= jwt_verify(token,process.env.JWT_Secret);
    const user= await User.findById(decoded.userId).select("-password ");

    if(!user){
        return res.json({Success: false, message:"User not found"});

    }

    req.user=user;
    next();
} catch(error){
    console.log (error.message);
    return res.json({Success:false, message:error.message});
}


}




