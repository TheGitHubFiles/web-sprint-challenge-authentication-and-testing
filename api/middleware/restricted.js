const jwt = require('jsonwebtoken')
const secret = "Bilbo"


module.exports = (req, res, next) => {

  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).json("token invalid")
      } else {
        req.decodedToken = decoded
        next()
      }
    })
  } else {
    res.status(400).json({ message: "token required" })
  }

};
