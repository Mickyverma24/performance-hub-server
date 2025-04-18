const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user')
// managing user login and signup
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
    
    if (!user) {
      return res.status(404).json({
        error: "No registered user found with the provided credentials.",
      });
    }
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ error: "email or password is not correct..!" });
    }
    res.status(200).send({
      name: user.name,
      email: user.email,
      apiKey: user.apiKey
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
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const apiKey = uuidv4()
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            apiKey: apiKey
        });

        await newUser.save();
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            apiKey: newUser.apiKey,
        });

    } catch (error) {
        console.error("Error while registering new user:", error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

module.exports = {loginController, signupController}