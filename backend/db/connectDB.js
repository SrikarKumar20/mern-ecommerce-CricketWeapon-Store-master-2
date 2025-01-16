const mongoose = require("mongoose");
require("dotenv").config({ path: "./backend/config/config.env" });
require("dotenv").config();


function connectDB() {
    mongoose.set("strictQuery", false); // Mongoose strict query option
  
    console.log("DB_LINK:", process.env.DB_LINK); // Debug environment variable
  
    mongoose
        .connect(process.env.DB_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("DB_connected");
        })
        .catch((err) => {
            console.log("DB connection error:", err);
            process.exit(1); // Exit process if DB connection fails
        });
}

module.exports = connectDB;
