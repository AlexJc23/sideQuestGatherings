const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const {Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op, Sequelize } = require('sequelize')


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();

router.get('/', async (req, res) => {

    const allGroups = await Group.findAll({include: [
        {model: GroupImage,
        attributes: ['imageUrl'],
        where: {preview: true},}
    ]});
    const groupData = [];

    for (const group of allGroups) {
        const memberCount = await Membership.count({
            where: {
                groupid: group.id
            }

        });


        groupData.push({
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers: memberCount,
            previewImage: group.GroupImages.length > 0 ? group.GroupImages[0].imageUrl : null
        });
    }

    return res.json({ groups: groupData });
});

router.get('/current', async (req, res) => {
    // Extract the userId from the current user
    try {const userId = req.user.id;
    // if(req.user === null) return res.json({message: 'Please Log in before proceeding.'});
    // Find all groups that the current user is a member of
    const userGroups = await Membership.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                // we want to "include" GROUP model with GROUPIMAGE to fetch the preview image
                model: Group,
                include: [
                    {
                        model: GroupImage,
                        attributes: ['imageUrl'],
                        where: { preview: true }
                    }
                ]
            }
        ]
    });

    // Declare an empty array for our data
    const groupData = [];

    // Iterate over each group
    for (const member of userGroups) {
        const group = member.Group;

        // COUNT the number of members for the current group
        const memberCount = await Membership.count({
            where: {
                groupid: group.id
            }
        });

        // put together the group data object and push it to groupData array
        groupData.push({
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers: memberCount,
            previewImage: group.GroupImages.length > 0 ? group.GroupImages[0].imageUrl : null
        });
    }


    return res.json({ groups: groupData });}
    catch(err) {
        return res.json({message: 'You must be signed in to view your groups.'})
    }

});

router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    let groupById = await Group.findByPk(parseInt(groupId))
    if(!groupById) {
        res.status(404).json({message:"Group couldn't be found"})

    }else {  groupById = await Group.findByPk(parseInt(groupId), {
        include: [
            {model: GroupImage},
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Venue, attributes: {exclude: ['createdAt', 'updatedAt']}}
        ]})
    const memberCount = await Membership.count({
        where: {
            groupid: groupById.id
        }
    });

    const groupData = {
        id: groupById.id,
        organizerId: groupById.organizerId,
        name: groupById.name,
        about: groupById.about,
        type: groupById.type,
        city: groupById.city,
        state: groupById.state,
        createdAt: groupById.createdAt,
        updatedAt: groupById.updatedAt,
        numMembers: memberCount,
        GroupImages: groupById.GroupImages,
        Organizer: groupById.User,
        Venues: groupById.Venues
    };
    res.json(groupData)}
});

router.post('/', async (req, res) => {
    
})

module.exports = router;
