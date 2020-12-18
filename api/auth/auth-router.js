const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model");
const jwt = require("jsonwebtoken");
const secret = "Bilbo";



const createToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "2000s",
  };
  return jwt.sign(payload, secret, options);
};
const checker = async (req, res, next) => {
  try {
    const check = await User.getBy({ username: req.body.username });
    if (check) {

      res.status(400).json("username taken");
    } else {
      next();
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};
const validate = (req, res, next) => {
  if (req.body.username && req.body.password) {
    next();
  } else {
    res.status(404).json("username and password required");
  }
};

router.post("/register", validate, checker, (req, res) => {
  const things = req.body;
  const hash = bcrypt.hashSync(things.password, 7);
  things.password = hash;
  User.add(things)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((e) => res.status(500).json(e.message));
});

router.post("/login", validate, (req, res) => {
  const { password, username } = req.body;
  User.getBy({ username: username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = createToken(user);
        res.status(200).json({ message: "here is your Token", token });
      } else {
        res.status(401).json("invalid credentials");
      }
    })

    .catch((err) => res.status(400).json(err.message));
});

module.exports = router;
