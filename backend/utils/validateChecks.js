const { handleValidationErrors } = require('./validation.js')
const { check } = require('express-validator');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage,Attendee } = require('../db/models');

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

const validateSignup = [
    check('email')
        .exists( { checkFalsy: true } )
        .isEmail()
        .isLength({min: 3, max: 256})
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 30})
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true})
        .isLength({min: 6})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

const validateGroupCreation = [
    check('name')
        .exists({checkFalsy: true})
        .isLength({min: 5, max: 60})
        .withMessage("Name must be 60 characters or less"),
    check('about')
        .exists({checkFalsy: true})
        .isLength({min: 50})
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({checkFalsy: true})
        .custom(value => {
            const values = ['Online', 'In person']
            if (!values.includes(value)) {
                throw new Error("Type must be 'Online' or 'In person'");
            }
            return true;
        }),
    check('private')
        .exists()
        .isBoolean()
        .withMessage( "Private must be a boolean"),
    check('city')
        .exists({checkFalsy: true})
        .withMessage("City is required"),
    check('state')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("State is required"),
    handleValidationErrors
];

const validateVenueCreation = [
    check('address')
        .exists({checkFalsy: true})
        .isLength({min: 5, max: 255})
        .withMessage("Street address is required"),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("State is required"),
    check('lat')
        .exists()
        .isFloat({ min: -90, max: 90 })
        .withMessage( "Latitude must be within -90 and 90"),
    check('lng')
        .exists()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be within -180 and 180"),
    handleValidationErrors
];
const validateEventCreation = [
    check('name')
        .exists()
        .isLength({min: 5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists()
        .isIn(['Online', 'In person', 'ONLINE', 'IN PERSON'])
        .withMessage('Type must be either Online or In person'),
    check('capacity')
        .exists()
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists()
        .isDecimal([2])
        .isFloat({ min: 0 })
        .withMessage("Price is invalid"),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage("Description is required"),
    check('startDate')
        .exists()
        .custom((value, { req }) => {
            // const startDate = value;
            const currentDate = new Date().getTime();
            const startVal = new Date(value).getTime()
            if (startVal < currentDate) {
                 throw new Error('Start date must be in the future');
            }
             return true;
            }),
    check('endDate')
        .exists()
        // .isDate()
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);

            if (endDate <= startDate) {
                throw new Error('End date is less than start date');
            }

            return value;
        }),
    handleValidationErrors
];

const validateMemberCreation = [
    check('status')
        .exists()
        .custom(value => {
            // Check if the status is either "co-host" or "member"
            if (value !== 'co-host' && value !== 'member') {
                throw new Error('Status must be either co-host or member');
            }
            return true; // Indicates the validation succeeded
        })
        .custom(value => {
            // Check if the status is not "pending"
            if (value === 'pending') {
                throw new Error("Cannot change a membership status to pending");
            }
            return true; // Indicates the validation succeeded
        }),
        handleValidationErrors
];

const validateAttendanceStatus = [
    check('status')
        .exists()
        .custom(value => {
            // Check if the status is not "pending"
            if (value === 'pending') {
                throw new Error("Cannot change an attendance status to pending");
            }
            return true; // Indicates the validation succeeded
        }),
        handleValidationErrors
];

const validateQueries = [
    check('page')
        .optional()
        .default(1)
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
        check('size')
        .optional()
        .default(20)
        .isInt({min: 1, max: 20})
        .withMessage("Size must be between 1 and 20"),
    check('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    check('type')
        .optional()
        .custom(value => {
            if (!value) {
                return true; // Optional field, so no validation needed if it's empty
            }

            if(['Online', 'In Person'].includes(value)) {
                return true
            } else {
                throw new Error("Type must be 'Online' or 'In Person'")
            }
        }),
    check('startDate')
        .optional()
        .isString()
        .custom(value => {
            if (!value) {
                return true; // Optional field, so no validation needed if it's empty
            }

            if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && value !== " ") {
                throw new Error('Start date must be in valid date format');
            }

            // Additional validation on the parsed date if needed

            return true; // Return true if validation succeeds
        })
        .withMessage('Start date must be a valid datetime'),
    handleValidationErrors
];

module.exports =
{
  validateLogin,
  validateSignup,
  validateVenueCreation,
  validateGroupCreation,
  validateEventCreation,
  validateMemberCreation,
  validateAttendanceStatus,
  validateQueries
}
