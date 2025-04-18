const User = require('../models/user')
const bcrypt = require("bcryptjs")
// managing user login and signup
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
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
    const userId = user._id;
    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      apiKey: userId
    });
  } catch (error) {
    console.log("Error while login :", error.message);
    res.status(400).send({ error: "Internal Server Error" });
  }
};


const signupController = async (req,res) =>{
    

}
module.exports = {loginController, signupController}