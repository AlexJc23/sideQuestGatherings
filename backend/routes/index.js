const express = require('express');
const router = express.Router();

router.get('/hello/world', (req, res) => {
    //setting a cookie on the response with the name of XSRF-TOKEN
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('HELLO WORLD!!')
});


module.exports = router;
