const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const generateToken = require("../utils/genrateToken");

// managing user login and signup

const expirationTime = "9999d"; // infinte expiration time of jwt token to make user logged in for a long time
const jwt_secret = process.env.JWT_SECRET;

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // finding user by it's email
    const user = await User.findOne({ email });

    // verifying password
    const isCorrectPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );
    // if user not exits
    if (!user) {
      return res.status(404).json({
        error: "No registered user found with the provided credentials.",
      });
    }
    // password is wrong
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ error: "email or password is not correct..!" });
    }
    // genrate authentication token
    const auth_token = generateToken(user._id, expirationTime, jwt_secret);
    // sucssfull resposne
    res.status(200).send({
      name: user.name,
      email: user.email,
      apiKey: user.apiKey,
      authToken: auth_token,
    });
  } catch (error) {
    console.log("Error while login :", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// sign up logic
const signupController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const apiKey = uuidv4();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      apiKey: apiKey,
    });
    // saving user in mongodb
    await newUser.save();
    // authentication token
    const auth_token = generateToken(newUser._id, expirationTime, jwt_secret);
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      apiKey: newUser.apiKey,
      authToken: auth_token,
    });
  } catch (error) {
    console.error("Error while registering new user:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const verificationController = async (req, res) => {
  try {
    // 1. Extract and validate headers
    const authHeader = req.headers.authorization;
    const apiKey = req.headers["x-api-key"];

    if (!authHeader || !apiKey) {
      return res
        .status(401)
        .json({ message: "Missing authentication headers" });
    }

    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Invalid Authorization header format" });
    }

    // 2. Verify JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(authToken, jwt_secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    // console.log(decodedToken)
    // 3. Find and validate user
    const user = await User.findOne({
      _id: decodedToken.userId,
    });
    // console.log(user)

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid API key or user not active" });
    }

    // 4. Return success
    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error(
      "Unexpected error during verification:",
      error.stack || error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { loginController, signupController, verificationController };
