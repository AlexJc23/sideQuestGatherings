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

const { ValidationError } = require('sequelize');


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

//resource not found error handler
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
})

//sequelize error-handler
app.use((err, req, res, next) => {
    if(err instanceof ValidationError) {
        let errors = {};
        for(let error of err.erros) {
            errors[error.path] = error.message
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err)
})

//error formatter error-handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});










module.exports = app;
