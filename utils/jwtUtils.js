// jwtUtils.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'default_secret_key';

const generateToken = (payload) => {
  console.log("Input Payload:", payload);
  
  const token = jwt.sign(payload, secretKey, {
    expiresIn: '1h', // Token expiration time
  });

  console.log("Generated Token:", token);
  
  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
