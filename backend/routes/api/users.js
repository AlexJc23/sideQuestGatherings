const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();

const {validateSignup, validateEmailandUser} = require('../../utils/validateChecks')



// Sign up
router.post(
  '/', validateSignup, validateEmailandUser,
  async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const emailUser = await User.findOne({where: {email: email}});
    if(emailUser) return res.status(500).json({message: "User with that email already exists"});

    const userEmail = await User.findOne({where: {username: username}})
    if(userEmail) return res.status(500).json({message: "User with that username already exists"})


    const user = await User.create({ firstName, lastName, username, email, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    // const findNewUser = await User.findOne({where: {
    //   email: safeUser.email
    // }});

    const newUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    }


    return res.json({
      user: newUser
    });
  }
);


module.exports = router;
