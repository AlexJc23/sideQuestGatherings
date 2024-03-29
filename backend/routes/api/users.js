const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide your last name.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 30})
        .withMessage('Please provide a username within 4 and 30 characters.')
        .custom(async (value) => {
            const user = await User.findOne({ where: { userName: value } });
            if (user) {
                throw new Error('Username already exists');
            }
        }),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('email')
        .exists( { checkFalsy: true } )
        .isEmail()
        .isLength({min: 3, max: 256})
        .withMessage('Please provide a valid email.')
        .custom(async (value) => {
            const user = await User.findOne({ where: { email: value } });
            if (user) {
                throw new Error('Email already exists. Proceed to sign in.');
            }
        }),
    check('password')
        .exists({ checkFalsy: true})
        .isLength({min: 6})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


// Sign up
router.post(
  '/', validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, username, email, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


module.exports = router;
