const { handleValidationErrors } = require('./validation.js')
const { check } = require('express-validator');

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

module.exports =
{
  validateVenueCreation,
  validateGroupCreation,
  validateEventCreation,
  validateMemberCreation,
  validateAttendanceStatus
}
