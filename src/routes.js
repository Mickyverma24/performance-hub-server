const express = require('express');
const authRoutes = require('../src/user/userRoutes');
const router = express.Router();

module.exports = () => router
  .use("/auth", authRoutes) 
  .get("/healthCheck", (req, res) => {
    res.send("Server is up and Running!");
  })


