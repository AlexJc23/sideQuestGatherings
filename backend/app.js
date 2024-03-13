const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
const routes = require('./routes/index');



app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

//security middleware
if(!isProduction) {
    //enable cors only in development :)
    app.use(cors());
};

//helmet will help set a variety of headers to better secure my app :)

app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

//setting the _csurf token and create a req.csrfToken method;

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use(routes);



module.exports = app;
