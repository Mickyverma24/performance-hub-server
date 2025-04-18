// Generating jwt token for user authenticationa and authrizations
const jwt = require('jsonwebtoken')
const generateToken = (userId, expirationTime, JWT_SECRET) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: expirationTime,
  });
  return token;
};

module.exports = generateToken
