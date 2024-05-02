
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage,Attendee } = require('../../db/models');
const {validateGroupCreation, validateVenueCreation, validateEventCreation, validateMemberCreation } = require('../../utils/validateChecks')

// const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { parse } = require('qs');
const { convertDate } = require('../../utils/helpFunc');
const router = express.Router();




router.get('/', requireAuth, async (req, res) => {

    const allGroups = await Group.unscoped().findAll({include: [
        {model: GroupImage,
        attributes: ['imageUrl'],
        order: [['preview', 'DESC']]
    }
    ]});
    const groupData = [];

    for (const group of allGroups) {
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
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
            createdAt: convertDate(group.createdAt),
            updatedAt: convertDate(group.updatedAt),
            numMembers: memberCount,
            previewImage: group.GroupImages.length > 0 ? group.GroupImages[0].imageUrl : null
        });
    }

    return res.json({ Groups: groupData });
});

router.get('/current', requireAuth, async (req, res, next) => {
    // Extract the userId from the current user

    const userId = req.user.id;

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
                        attributes: ['imageUrl', 'createdAt', 'updatedAt'],
                        order: [['preview', 'DESC']]
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
        // console.log('hellllooooo', member.Group.createdAt)
        // COUNT the number of members for the current group
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
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
            createdAt: convertDate(group.createdAt),
            updatedAt: convertDate(group.updatedAt),
            numMembers: memberCount,
            previewImage: group.GroupImages.length > 0 ? group.GroupImages[0].imageUrl : null
        });
    }


    return res.send({ Groups: groupData });

});

//get details of groups by id
router.get('/:groupId', requireAuth, async (req, res) => {
    const { groupId } = req.params;
    let groupById = await Group.findByPk(parseInt(groupId))
    if(!groupById) {
        res.status(404).json({message:"Group couldn't be found"})

    }else {  groupById = await Group.unscoped().findByPk(parseInt(groupId), {
        include: [
            {model: GroupImage, attributes: ['id', 'imageUrl', 'preview']},
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Venue, attributes: {exclude: ['createdAt', 'updatedAt']}}
        ]})
    const memberCount = await Membership.count({
        where: {
            groupId: groupById.id
        }
    });

    const groupData = {
        id: groupById.id,
        organizerId: groupById.organizerId,
        name: groupById.name,
        about: groupById.about,
        type: groupById.type,
        private: groupById.private,
        city: groupById.city,
        state: groupById.state,
        createdAt: convertDate(groupById.createdAt),
        updatedAt: convertDate(groupById.updatedAt),
        numMembers: memberCount,
        GroupImages: groupById.GroupImages.map(groupimg => ({
            id: groupimg.id,
            url: groupimg.imageUrl,
            preview: groupimg.preview
        })),
        Organizer: groupById.User,
        Venues: groupById.Venues.length > 0 ? groupById.Venues.map(venue => ({
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: Number(venue.latitude),
            lng: Number(venue.longitude)
        })) : null
    };
    res.json(groupData)}
});

router.post('/', requireAuth, validateGroupCreation,  async (req, res) => {
    const {name, about, type, private, city, state} = req.body;
    const userId = req.user.id;

    const newGroup = await Group.create({
        organizerId: userId,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    });

    const newMembership = await Membership.create({
        userId: userId,
        groupId: newGroup.id,
        status: 'owner'
    });

    const newGroupAdd = {
        id: newGroup.id,
        organizerId: newGroup.organizerId,
        name: newGroup.name,
        about: newGroup.about,
        type: newGroup.type,
        private: newGroup.private,
        city: newGroup.city,
        state: newGroup.state,
        createdAt: convertDate(newGroup.createdAt),
        updatedAt: convertDate(newGroup.updatedAt)
    }
    return res.status(201).json(newGroupAdd)
});


router.post('/:groupId/images',  requireAuth, async (req, res, next) => {
    //grab the queries for creating a new image
    const { url, preview } = req.body;
    const userId = req.user.id;
    const { groupId } = req.params;


    const group = await Group.findByPk(parseInt(groupId));
    if (!group) return res.status(404).json({ message: `Group couldn't be found` });

    if (group.organizerId === userId) {
        const newImage = await GroupImage.create({
            groupId: group.id,
            imageUrl: url,
            preview: preview
        });

    const image = await GroupImage.findByPk(newImage.id);

    const confirmedImage = {
        id: image.id,
        url: image.imageUrl,
        preview: image.preview
    }

        return res.json(confirmedImage);
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }
});

router.put('/:groupId', requireAuth, validateGroupCreation, async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body;

    const groupById = await Group.unscoped().findByPk(parseInt(groupId));

    if (!groupById) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (groupById.organizerId === userId) {
        try {
            groupById.set({
                name,
                about,
                type,
                private,
                city,
                state

            });

            // Saving changes to the database
            await groupById.save();
            const confirmedGroupChange = {
                id: groupById.id,
                organizerId: groupById.organizerId,
                name: groupById.name,
                about: groupById.about,
                type: groupById.type,
                private: groupById.private,
                city: groupById.city,
                state: groupById.city,
                createdAt: convertDate(groupById.createdAt),
                updatedAt: convertDate(groupById.updatedAt)
            };
            return res.json(confirmedGroupChange);
        } catch (error) {
            // Handling any database save error
            return next(error);
        }
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }
});

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id;
    const groupId = req.params.groupId;


        // Check if the group exists
        const group = await Group.findByPk(parseInt(groupId));
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }

        // Check if the current user is the owner of the group
        if (group.organizerId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden" });
        };


        // Delete the group
        await group.destroy();

        return res.status(200).json({ message: "Successfully deleted" });


});


//get all venues by group Id
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"});

    const user = await User.findByPk(parseInt(userId));
    if(!user) return res.status(403).json({message: "Forbidden"});

    const membership = await Membership.findOne({where: {userId: userId, groupId: groupId}});

    const statues = ['member', 'pending'];
    if(!membership || statues.includes(membership.status.toLowerCase())) return res.status(403).json({message: "Forbidden"});

    const venues = await Venue.findAll({where: {groupId: groupId}})

    const vens = []
    for( const venue of venues ) {

        vens.push({
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: Number(venue.latitude),
            lng: Number(venue.longitude)
        })

    }

    return res.json({Venues: vens})

});

//create a venue by group Id
router.post('/:groupId/venues', requireAuth, validateVenueCreation, async (req, res, next) => {
    const groupId = req.params.groupId;
    const currentUser = req.user;
    const {address, city, state, lat, lng} = req.body;
    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"})

    const member = await Membership.findByPk(parseInt(currentUser.id), {where: {
        groupId: groupId, userId: currentUser.id
    }});
    if(!member) return res.status(403).json({message: "Forbidden"});

    const statuses = ['co-host', 'owner']
    if(statuses.includes(member.status.toLowerCase())) {
        const newVenue = await Venue.unscoped().create( {
            groupId: groupId,
            address: address,
            city: city,
            state: state,
            latitude: lat,
            longitude: lng
        });

        const findNewVenue = await Venue.findByPk(newVenue.id);

        const confirmedVenue = {
            id: findNewVenue.id,
            groupId: findNewVenue.groupId,
            address: findNewVenue.address,
            city: findNewVenue.city,
            state: findNewVenue.state,
            lat: Number(findNewVenue.latitude),
            lng: Number(findNewVenue.longitude)
        }

        return res.json(confirmedVenue)
    } else {
        return res.status(403).json({message: "Forbidden"})
    }
});
router.get('/:groupId/events', async (req, res) => {
    const groupId = req.params.groupId;
    const groups = await Group.findByPk(parseInt(groupId))
    let allEvents = [];

    if(!groups) return res.status(404).json({message: "Group couldn't be found"})
    const events = await Event.findAll({
        where: {groupId: parseInt(groupId)},
        include: [

            {model: EventImage,
                attributes: ['imageUrl'],
                order: [['preview', 'DESC']]
            },
            {model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {model: Venue,
            attributes: ['id', 'city', 'state']
            }
        ]
    });

    for (const event of events) {
        const attending = await Attendee.count({
            where: {
                eventId: event.id
            }

        });

        allEvents.push ({
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            startDate: convertDate(event.startDate),
            endDate: convertDate(event.endDate),
            numAttending: attending,
            previewImage: event.EventImages.length > 0 ? event.EventImages[0].imageUrl : null,
            Group: event.Group,
            Venue: event.Venue
        });
    }
        return res.json({Events: allEvents})
});

router.post('/:groupId/events', requireAuth, validateEventCreation, async (req, res) => {
    const groupId = req.params.groupId;
    const venueId = req.body.venueId;
    const currentUser = req.user;

    const { name, type, capacity, price, description, startDate, endDate} = req.body;

    const group = await Group.findByPk(parseInt(groupId));
        if(!group) return res.status(404).json({message: "Group couldn't be found"});

    const venue = await Venue.findByPk(parseInt(venueId));
        if(!venue) return res.status(404).json({message: "Venue couldn't be found"});


    const member = await Membership.findOne({where: {
        groupId: groupId, userId: currentUser.id
    }});
    if(!member) return res.status(403).json({message: 'Forbidden'});

    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST')) {
    const newEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    const confirmedEvent = {
        id: newEvent.id,
        groupId: Number(newEvent.groupId),
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: parseFloat(newEvent.price),
        description: newEvent.description,
        startDate: convertDate(newEvent.startDate),
        endDate: convertDate(newEvent.endDate)

    }
    return res.json(confirmedEvent);
    } else {
        res.status(403).json({message: "Forbidden"})
    }
});


//might need to come back to this to debug after publishing
router.get('/:groupId/members', async (req, res) => {

    const currentUser = req.user;
    const groupId = req.params.groupId;

    const group = await Group.findByPk(parseInt(groupId));

    if (!group) return res.status(404).json({ message: "Group couldn't be found" });

    const membersOfGroupId = [];

    const currentMember = await Membership.findOne({
        where: {
            userId: currentUser.id,
            groupId: groupId
        }
    });

    let members;
    if (!currentMember || currentMember.status.toUpperCase() === 'PENDING' || currentMember.status.toUpperCase() === 'MEMBER') {
        // If current user is not a member yet or is pending, return all non-pending members
        members = await Membership.findAll({
            where: {
                groupId: groupId,
                status: { [Op.ne]: 'pending' }
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
    } else {
        // If current user is owner or co-host, return all members
        members = await Membership.findAll({
            where: {
                groupId: groupId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
    }


    //iterate through the array and postion how frontend will need it
    for (const member of members) {
        membersOfGroupId.push({
            id: member.User.id,
            firstName: member.User.firstName,
            lastName: member.User.lastName,
            Membership: {
                status: member.status
            }
        });
    };

    return res.status(200).json({ Members: membersOfGroupId });
});

//request membership to groupId
router.post('/:groupId/membership', requireAuth, async (req, res) => {

    const memberId = req.user.id;
    const groupId = req.params.groupId;


    const group = await Group.findByPk(parseInt(groupId));

    if(!group) return res.status(404).json({message: "Group couldn't be found"})



    const currentMember = await Membership.findOne(
        {where: {
            userId: memberId, groupId: groupId
        }}
    );


    if(!currentMember) {
        const newMember = await Membership.create({
            userId: memberId,
            groupId: groupId,
            status: 'pending'
        });

        return res.json({
            memberId: memberId,
            status: newMember.status
          });

    };


    const statuses = ['owner', 'co-host', 'member'];
    if(statuses.includes(currentMember.status.toLowerCase())) return res.status(400).json({message: "User is already a member of the group"})

    if(currentMember.status.toLowerCase() === 'pending') return res.status(400).json({message: "Membership has already been requested"})

});

//change membership
router.put('/:groupId/membership', requireAuth, validateMemberCreation, async(req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const { memberId, status } = req.body;


        // Find the group
        const group = await Group.findByPk(parseInt(groupId));
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        };

        const currentUser = await User.findByPk(parseInt(userId));
        if(!currentUser) return res.status(403).json({message: "Forbidden"})

        // // Find the current user's membership in the group
        const member = await User.findByPk(parseInt(memberId));
        if (!member) return res.status(400).json({ message: "User couldn't be found" });

        // const currentUserMembership = await Membership.findOne({ where: { userId: memberId, groupId: groupId } });
        // // Check if the current user is authorized to change the membership status

        const currentMember = await Membership.findOne({where: {userId: userId, groupId: groupId}})
        if (!currentMember||!(currentMember.status.toLowerCase() === 'owner' || currentMember.status.toLowerCase() === 'co-host')) return res.status(403).json({ message: "Forbidden" });
        // return res.json(currentMember.status.toLowerCase())
        // // Find the membership to be updated
        const memberToUpdate = await Membership.findOne({ where: { userId: memberId, groupId: groupId } });
        if (!memberToUpdate) {
            return res.status(404).json({ message: "Membership between the user and the group does not exist" });
        }


        if (status.toLowerCase() === 'co-host' && currentMember.status.toLowerCase() !== 'owner') {
                        return res.status(403).json({ message: "Forbidden" });
                    }


            // Update the membership status
            memberToUpdate.status = status;
            await memberToUpdate.save();

            // Return the updated membership details
            const confirmedChange = {
            id: memberToUpdate.id,
            groupId: memberToUpdate.groupId,
            memberId: memberToUpdate.userId,
            status: memberToUpdate.status
        };
        return res.status(200).json(confirmedChange);

});

//delete specified membership by membership id
router.delete('/:groupId/membership/:memberId', requireAuth, async (req, res, next) => {
    const { groupId, memberId } = req.params
    const currentUser = req.user.id;

    const group = await Group.findByPk(groupId);

    const currentMemberUser = await User.findByPk(memberId);

    const memberToDelete = await Membership.findOne({where : {userId: memberId, groupId: groupId}})

    //if no group exists return 404 error
    if (!group) return res.status(404).json({message: "Group couldn't be found"})

    //if there isnt a user with specified memberId return 404 error
    if (!currentMemberUser) return res.status(404).json({message: "User couldn't be found"})

    //if there isnt a membership associated to this group return 404 error
    if (!memberToDelete) return res.status(404).json({message: "Membership does not exist for this User"})


    //delete own membership
    if (parseInt(currentUser) === parseInt(memberId)) {
        await memberToDelete.destroy();
        return res.status(200).json({
            message: "Successfully deleted membership from group"
        })
    }

    //if current user isnt the owner... send them to the shadow realm!!!
    if (group.organizerId !== currentUser) return res.status(403).json({message: "Forbidden"})


    await memberToDelete.destroy();

    return res.status(200).json({message: "Successfully deleted membership from group"})

});

module.exports = router;
