const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const { user } = req;
    if(user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        return res.json({
            user: safeUser
        })
    } else {
        return res.json({
            user: null
        });
    }
});


router.post('/', async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
    }
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

router.delete('/', async (req, res) => {
    res.clearCookie('token');
    return res.json({
        message: 'Success'
    });
});





module.exports = router;
