const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');


const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');



const {validateLogin} = require('../../utils/validateChecks')

const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

// const validateLogin = [
//     check('credential')
//         .exists({ checkFalsy: true })
//         .notEmpty()
//         .withMessage('Please provide a valid email or username.'),
//     check('password')
//         .exists({ checkFalsy: true })
//         .withMessage('Please provide a password.'),
//     handleValidationErrors
// ];




router.get('/', async (req, res) => {
    const { user } = req;
    if(user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        const currentUser = await User.findByPk(user.id)

        return res.json({

            user: currentUser
        })
    } else {
        return res.json({
            user: null
        });
    }

});


// Log in
router.post(
    '/', validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        // const err = new Error('Login failed');
        // err.status = 401;
        // err.title = 'Login failed';
        // err.errors = { credential: 'Invalid credentials' };
        return res.status(401).json({message: 'Invalid credentials'});
      }

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const currentUser = await User.findByPk(safeUser.id)

      const userInfo = {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username

      }
      await setTokenCookie(res, safeUser);

      return res.json({
        user: userInfo
      });
    }
  );

router.delete('/', async (req, res) => {
    res.clearCookie('token');
    return res.json({
        message: 'Success'
    });
});





module.exports = router;
