var mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://hainguyen56211:y61j7BMvgw06fPTn@cluster0.rdlnrj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = {
  connectDB,
};
