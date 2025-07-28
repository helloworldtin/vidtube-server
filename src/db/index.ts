import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("\nMongo DB Connected!!" + connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};


export default connectDB;