import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectMongoDB() {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }
        
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB Already Connected (Reusing Connection)");
            return;
        }
        
        // Connect if not already connected
        await mongoose.connect(MONGODB_URI);
        console.log("Successfully Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error
    }
};

export default connectMongoDB;
