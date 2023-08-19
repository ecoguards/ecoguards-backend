const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { handleErrors } = require("../errors/handleErrors");

module.exports.register_post = async (req, res) => {
  try {
    const { fullName, email, password, countryOfResidence } = req.body;

    //check if user already exists
    const userEmail = await User.findOne({ email: req.body.email });

    if (userEmail) {
      return res.status(400).json({
        status: "fail",
        message: "user already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      countryOfResidence,
    });
    res.status(201).json({
      status: "success",
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
};

module.exports.login = async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "user does not exist",
      });
    }
    //if user found compare password
    const validPassword =  await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if password is not valid
    if (!validPassword) {
      return res.status(400).json({
        status: "fail",
        message: "invalid password",
      });
    }
    //if password is valid create token
    const token = jwt.sign({ _id: user._id }, process.env.MY_SECRET, {
      expiresIn: "7days",
    });
    //verify token

    const verified = jwt.verify(token, process.env.MY_SECRET);
    //send token to client
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      status: "success",
      message: "user logged in successfully",
      data: verified,
    });
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({
    status: "success",
    message: "user logged out successfully",
  });
};