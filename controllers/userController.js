const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { handleErrors } = require("../errors/handleErrors");
const nodemailer = require("nodemailer");


//function to generate 4 digit code
const generateCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
};

module.exports.signUp_post = async (req, res) => {
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
    
    
    //generate 4 digit code
    const code = generateCode();

    //store code with user's data in database
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      countryOfResidence,
      twoFactorSecret: code,
      twoFactorCodeExpires: Date.now() + 600000,  
    });


    //send code to user's email
    const transporter = nodemailer.createTransport({
      service: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    //verify connection configuration
    transporter.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log("server is ready to take messages");
      }
    }
    );
    await transporter.sendMail({
      from:process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<h2>Thank you for registering with Ecoguard</h2>
      <p>Your verification code is ${code}</p>
      <p>This code will expire in 5 minutes</p>`,
    });
    res.status(201).json({
      status: "success",
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
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
    const validPassword = await bcrypt.compare(
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
    if (user.twoFactorSecret !== req.body.code || user.twoFactorCodeExpires < Date.now()) {
      return res.status(400).json({
        status: "fail",
        message: "invalid code",
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
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({
    status: "success",
    message: "user logged out successfully",
  });
};
