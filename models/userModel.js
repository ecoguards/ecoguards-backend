const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "please enter your fullname"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      unique: true,
      minlength: [8, "minimum password length is 8 character"],
    },
    countryOfResidence: {
      type: String,
      required: [true, "please enter your country of residence"],
    },

    
  },
  
  { 
    verifed: Boolean 

  },

  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
