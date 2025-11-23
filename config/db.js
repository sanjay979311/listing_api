// src/config/db.js
import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/digitalindialearning", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectToDB;



