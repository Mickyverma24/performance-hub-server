// user schema what details of user we are stroing 
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: {type: String, required: true}
});
// making User interface for performing operation on monogoDB users colletions
const User = mongoose.model("User", userSchema);
module.exports = User
