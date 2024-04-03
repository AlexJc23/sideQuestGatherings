const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage, Attendee } = require('../../db/models');


const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const currentUser = req.user;
    const imageId = req.params.imageId;

    const groupImage = await GroupImage.unscoped().findByPk(parseInt(imageId));
    if(!groupImage) return res.status(404).json({message: "Group Image couldn't be found"});

    const currentMember = await Membership.findOne(
        {where: {
            userId: currentUser.id, groupId: groupImage.groupId
        }}
    );
    if(!currentMember) return res.status(403).json({message: "Forbidden"})

    const statuses = ['owner', 'co-host'];
    if(statuses.includes(currentMember.status.toLowerCase())) {
        groupImage.destroy()
        return res.status(200).json({message: "Successfully deleted"})
    } else {
        return res.status(403).json({message: "Forbidden"})
    };

});


module.exports = router;
