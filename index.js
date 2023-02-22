const express = require("express");
const {auth, checkAuth} = require("./authentication");
const path = require("path");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();


//Express instance
const app = express();


// MongoDB connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Database connected successfully");
});

//Export auth instance
// exports.auth = auth;

auth.configAuth({
  salt: process.env.SALT,
  secret: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
});

exports.auth = auth;
exports.checkAuth = checkAuth;

//Express middleware
app.use(express.json());


//Express routes
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:7777"],
  credentials: true,
}));
const appRoutes = require("./router/app.route");
app.use('/api', appRoutes);



//Express static files
app.use(express.static(path.join(__dirname, "sensor_monitoring/build")));
app.use("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "sensor_monitoring/build", "index.html"));
});


//Global error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = "Something went wrong";
  const code = err.code || null;
  res.status(status).json({
    statue: 500,
    type: "error",
    message,
    code,
  });
});

//Server listen
// app.listen(process.env.PORT, () => {
//   console.log(`Server running at port ${process.env.PORT}`);//first commit
// });
module.e