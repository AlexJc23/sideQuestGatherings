const { handleValidationErrors } = require('./validation.js')
const { check } = require('express-validator');

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

module.exports = { validateVenueCreation }
