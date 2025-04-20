const express = require('express')
const {loginController, signupController, verificationController} = require("../user/authController")
const router = express.Router()


router.post("/login",loginController)
router.post("/signup",signupController)
router.get("/verify",verificationController)
module.exports = router 
