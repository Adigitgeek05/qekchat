import bcrypt from 'bcrypt';
import User from '../models/User.js';
import {generateToken} from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';


// Sign up a new User
export const signup = async () => {
    const {fullName, email, password, profilePic, bio} = req.body;


    try{
        if(!fullName || !email || !password || !bio) {
            return res.status(400).json({success:false, message: "Please fill all the fields"});   
        }
        const user= await User.findOne({email});
        if(user) {
            return res.status(400).json({success:false, message: "User already exists"});
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser= await User.create({
            fullName,
            email,
            password: hashedPassword,
            profilePic: profilePic,
            bio: bio 
        }); 

        const token = generateToken(newUser._id);
        res.json({success:true,userData: newUser, token,message: "User created successfully"});
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}


//controller for login
export const login = async (req, res) => {
    

    try {
        const {email, password} = req.body;
        const UserData= await User.findOne({email});
        const isPasswordCorrect= await bcrypt.compare(password, UserData.password);

        if(!isPasswordCorrect){
            return res.json({success:false, message: "Invalid credentials"});

        }

        const token = generateToken(UserData._id);
        return res.json({success:true, UserData,token, message:"Login successful"})
       
    } catch (error) {
        console.log (error.message);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}

// Controller to check if user is authenticated

export const checkAuth= async (req,res) => {

    res.json({success:true, user:req.user});
    
}

// controller to update user profile details
export const updateProfile= async(req,res)=> {
    try{
        const {profilePic,bio,fullName}=req.body;

        const userId= req.user._id;
        let updateUser;
        if(!profilePic){
            await User.findByIdAndUpdate(userId,{bio, fullName}, {new: true});

        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updateUser= await User.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                bio,
                fullName
            }, {new: true});
        }
        res.json({success:true, user:updateUser, message: "Profile updated successfully"});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}


