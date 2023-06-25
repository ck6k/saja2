const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


dotenv.config({path:"./config.env"})
require('../backend/db/conn')
const User = require('./model/userSchema')

app.use(express.json());

app.use(require('./router/auth'))

const PORT = process.env.PORT || 5000;
app.post('/api/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const token = generatePasswordResetToken();

    // Store the token and its expiration date in the user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the password reset link to the user's email
    const resetLink = `http://localhost:3000/resetpassword?token=${token}`;
    sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to generate a random password reset token
const generatePasswordResetToken = () => {
  const length = 20;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Helper function to send the password reset email
const sendResetPasswordEmail = (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Update with your email service provider
    auth: {
      user: 'ckn6489@gmail.com', // Update with your email address
     pass: 'yuhqozvdlfybtwzl',
    },
  });

  const mailOptions = {
    from: 'ckn6489@gmail.com', // Update with your email address
    to: email,
    subject: 'Reset Password',
    html: `<p>Click the following link to reset your password:</p>
           <p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};



app.listen(PORT, () => {
  console.log('Server is running on port' ,PORT);
});