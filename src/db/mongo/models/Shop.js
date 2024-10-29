import mongoose, { Schema } from "mongoose";

const User = mongoose.model('User', new Schema({
  name: String
}));

export default User;