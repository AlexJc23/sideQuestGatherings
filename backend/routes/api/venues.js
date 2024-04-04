
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { validateVenueCreation } = require('../../utils/validateChecks')
// const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();

router.put('/:venueId', requireAuth, validateVenueCreation, async (req, res, next) => {


    const venueId = req.params.venueId;
    const currentUser = req.user;
    const {address, city, state, lat, lng} = req.body;

    const venueById = await Venue.findByPk(parseInt(venueId), {attributes: { exclude: ['updatedAt', 'createdAt'] }});

    if(!venueById) return res.json({message: "Venue couldn't be found"});

    const member = await Membership.findByPk(parseInt(currentUser.id), {where: {
        groupId: venueById.groupId, userId: currentUser.id
    }});

    venueById.set({
        address: address,
        city: city,
        state: state,
        latitude: lat,
        longitude: lng
    })


    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST')) {
        venueById.save()
        return res.json(venueById)
    } else {
        return res.status(403).json({message: "Forbidden"})
    }
})


module.exports = router;
