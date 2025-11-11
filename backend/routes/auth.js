const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

const User = require('../models/User');
const sendEmail = require('../utils/mailer');

// register
router.post('/register', async (req, res) => {
  try{
    const { email, password, role } = req.body;
    if(!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    // mark as verified by default (no email verification flow)
    const userData = { email, passwordHash, role, isVerified: true };
    
    // Accept profile fields for all roles
    if(req.body.profile){
      userData.profile = req.body.profile;
    }
    
    const user = new User(userData);
    await user.save();
    res.status(201).json({ msg: 'Registered. You can now login.' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
    res.json({ token });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
