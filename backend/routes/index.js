const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

router.use('/api', apiRouter);


// router.get('/hello/world', (req, res) => {
//     //setting a cookie on the response with the name of XSRF-TOKEN
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.send('HELLO WORLD!!')
// });

router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-TOKEN' : csrfToken
    });
});



module.exports = router;
