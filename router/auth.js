const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
require('../db/conn')

router.get('/',(req,res) => {
    res.send('dfghjkl');
})
router.post('/register', async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const newUser = new User({ name, email, password,  mobile });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });



  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Incorrect credentials' });
      }
      return res.status(200).json({ message: 'Login successful', name: user.name });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
