import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mayankprajapati239:61QoTZXHNp3qszCv@cluster1x1.6iqax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1x1" ;

export const connectToDB = async () => {
    if (mongoose.connection.readyState >=1) return;
    try {
        await mongoose.connect (MONGO_URI, {
            dbname: "taskmanager",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any);
        console.log("Connected to Mongo");
    } catch(error){
        console.error("MongoDB connection error", error);
    }
};