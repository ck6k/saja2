const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile:Number
  });
  
  // Create User model
  const User = mongoose.model('USER', userSchema);

  module.exports = User