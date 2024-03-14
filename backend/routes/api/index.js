const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

const { setTokenCookie, restoreUser, requireAuth  } = require('../../utils/auth.js');

const { User } = require('../../db/models')


// Connect restoreUser middleware to the API router
  // If the current user session is valid, set req.user to the user in the database
  // If the current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter)


router.post('/test', (req, res) => {
    res.json({requestBody: req.body});
});






module.exports = router;



//testing authentication

// router.get('/require-auth', requireAuth, (req,res) => {
//     return res.json(req.user)
// })

// router.get('/set-token-cookie', async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'TestUser1'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({user: user });
// });

// router.get('/restore-user',
// (req, res) => {
//     return res.json(req.user)
// });
