const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        hashedPassword
    });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.userName
    };

    await setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })

})

module.exports = router;
