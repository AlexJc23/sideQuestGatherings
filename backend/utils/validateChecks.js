const { handleValidationErrors } = require('./validation.js')
const { check } = require('express-validator');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage,Attendee } = require('../db/models');

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
        .isFloat({ min: 0 })
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage("Price is invalid"),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage("Description is required"),
    check('startDate')
        .exists()
        // .isDate()
        .custom((value, { req }) => {
            const startDate = new Date(value);
            const currentDate = new Date();

            if (startDate <= currentDate) {
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

            // Indicates the success of this synchronous custom validator
            return true;
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
        .isInt({ min: 1, max: 10 })
        .default(1)
        .withMessage('Page must be greater than or equal to 1 or less than or equal to 10'),
    check('size')
        .optional()
        .isInt({min: 1, max: 20})
        .default(20)
        .withMessage("Size must be greater than or equal to 1 and less than or equal to 20"),
    check('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    check('type')
        .optional()
        .isIn(['Online', 'In Person'])
        .withMessage("Type must be 'Online' or 'In Person'"),
    check('startDate')
        .optional()
        .isISO8601()

        .withMessage('"Start date must be a valid datetime"'),
    handleValidationErrors
];

module.exports =
{
  validateSignup,
  validateVenueCreation,
  validateGroupCreation,
  validateEventCreation,
  validateMemberCreation,
  validateAttendanceStatus,
  validateQueries
}
