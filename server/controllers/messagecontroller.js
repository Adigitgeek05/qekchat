import Message from "../models/Message,js";
import cloudinary from "../lib/cloudinary.js";


export const getuserforSidebar= async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers= await User.find({_id:{$ne: userId}}).select("-password ");
        // Count no. of messages for each user

        const unseenMessages={}
        const promises= filteredUsers.map(async (user) => {
            const messages= await Message.find({senderId: user._id, receiverId: userId, seen: false});
            if(messages.length>0)
            {
                unseenMessages[user._id]= messages.length;
            }

        })
        await Promise.all(promises);
        res.json({succes:true, users: filteredUsers, unseenMessages});


    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message});



        
    }
}

// Get all messages for selected user
export const getMessages= async (req, res) => {
    try {
        const {id: selecteduserId}= req.params;
       const myId= req.user._id;

       const messages= await Message.find({
        $or: [
            {senderId: myId, receiverId: selecteduserId},
            {senderId: selecteduserId, receiverId: myId}
        ]
       })
       await Message.updateMany(
        {
            senderId: selecteduserId,
            receiverId: myId,
            seen: true
        }
        )
        res.json({success: true, messages});

    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message});
    }
}

export const markMessagesSeen= async (req, res) => {
    try {
        const {id }= req.params;
        await Message.updateMany(
            {
                senderId: id,
                receiverId: req.user._id,
                seen: false
            },
            {seen: true}
        );
        res.json({success: true});
        
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message});
        
    }
}


export const sendMessage = async (req,res)=> {
    try {
        const {text,image}=req.body;
        const receiverId= req.params.id;
        const senderId= req.user._id;
        let imageUrl;

        if(image){
            const UploadResponse= await cloudinary.uploader.upload(image);
            imageUrl= UploadResponse.secure_url;
        }

        const newMessage= await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
              });

            res.json({success: true, message: newMessage, message: "Message sent successfully"});
      
    } catch (error) {
        
    }
}