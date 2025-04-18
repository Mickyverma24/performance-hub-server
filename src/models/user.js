// user schema what details of user we are stroing 
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  api_key: {type: String, required: true}
});
// making User interface for performing operation on monogoDB users colletions
const User = mongoose.model("User", userSchema);
export default User;
