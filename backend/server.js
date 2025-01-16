const app = require("./app");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const cloudinary = require("cloudinary");
const cookieParser = require('cookie-parser');



// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
});

// Load Config
dotenv.config({ path: "./config/config.env" });


app.use(cookieParser());

const userRoute = require("./route/userRoute");
app.use("/api/users", userRoute);



// Debugging Environment Variables
console.log("Loaded PORT:", process.env.PORT);
console.log("Loaded DB_LINK:", process.env.DB_LINK);
console.log("Loaded CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);

// Connect With MongoDB
connectDB();

// Connect with Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});
