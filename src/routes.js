const express = require('express')
const authRoutes = require('../src/user/userRoutes')
const router = express.Router()


module.exports = () => router.get("/",()=>{console.log("someone requesting..")})