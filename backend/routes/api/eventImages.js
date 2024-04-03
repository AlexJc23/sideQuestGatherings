
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage, Attendee } = require('../../db/models');


const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res) => {
    const currentUser = req.user;
    const imageId = req.params.imageId;

    const eventImage = await EventImage.unscoped().findByPk(parseInt(imageId));
    if(!eventImage) return res.status(404).json({message: "Event Image couldn't be found"});

    const event = await Event.findByPk(eventImage.eventId);
    const currentMember = await Membership.findOne(
        {where: {
            userId: currentUser.id, groupId: event.groupId
        }}
    );
    if(!currentMember) return res.status(403).json({message: "Forbidden"})

    const statuses = ['owner', 'co-host'];
    if(statuses.includes(currentMember.status.toLowerCase())) {
        eventImage.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    } else {
        return res.status(403).json({message: "Forbidden"})
    };

});
module.exports = router;
