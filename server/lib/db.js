import mongoose from 'mongoose';



export const connectDB = async () => {
    try{
         const connectionInstance = await mongoose.connect("mongodb://localhost:27017/QekChat/DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    } catch (error) {

        console.log(error);
        


    }
}
