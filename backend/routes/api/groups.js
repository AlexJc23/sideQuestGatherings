
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, GroupImage, EventImage,Attendee } = require('../../db/models');
const {validateGroupCreation, validateVenueCreation, validateEventCreation, validateMemberCreation } = require('../../utils/validateChecks')
const {convertDate} = require('../../utils/helpFunc');
// const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { parse } = require('qs');
const router = express.Router();




router.get('/', async (req, res) => {

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
                        attributes: ['imageUrl'],
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
            createdAt: group.convertDate(createdAt),
            updatedAt: group.convertDate(updatedAt),
            numMembers: memberCount,
            previewImage: group.GroupImages.length > 0 ? group.GroupImages[0].imageUrl : null
        });
    }


    return res.send({ groups: groupData });

});

router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    let groupById = await Group.findByPk(parseInt(groupId))
    if(!groupById) {
        res.status(404).json({message:"Group couldn't be found"})

    }else {  groupById = await Group.unscoped().findByPk(parseInt(groupId), {
        include: [
            {model: GroupImage},
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
        GroupImages: groupById.GroupImages,
        Organizer: groupById.User,
        Venues: groupById.Venues.map(venue => ({
                id: venue.id,
                groupId: venue.groupId,
                address: venue.address,
                city: venue.city,
                state: venue.state,
                lat: venue.latitude,
                lng: venue.longitude
            }))
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

    res.status(201).json(newGroup)
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

    const image = await GroupImage.findByPk(newImage.id)

        return res.json(image);
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
            return res.json(groupById);
        } catch (error) {
            // Handling any database save error
            return next(error);
        }
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }
});

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    const groupById = await Group.findByPk(parseInt(groupId));
    const membership = await Membership.findOne({where: {
        userId: userId,
        groupId: groupId
    }});
    if (!groupById) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (groupById.organizerId === userId) {
        await membership.destroy();
        await groupById.destroy();
        res.json({message: "Successfully deleted"})
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }

});

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const groupId = req.params.groupId;
    const currentUser = req.user;

    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"})

    const member = await Membership.findByPk(parseInt(currentUser.id), {where: {
        groupId: groupId, userId: currentUser.id
    }});


        if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST') && group.organizerId === currentUser.id) {
            const venues = await Venue.findAll( {
                where: {groupId: groupId}
            })
            const allVenues = venues.map(venue => ({
                id: venue.id,
                groupId: venue.groupId,
                address: venue.address,
                city: venue.city,
                state: venue.state,
                lat: venue.latitude,
                lng: venue.longitude
            }));
            res.json({Venues: allVenues})
        } else {
            return res.status(403).json({message: "Forbidden"})
        }
    }
);

router.post('/:groupId/venues', requireAuth, validateVenueCreation, async (req, res, next) => {
    const groupId = req.params.groupId;
    const currentUser = req.user;
    const {address, city, state, lat, lng} = req.body;
    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"})

    const member = await Membership.findOne({where: {
        groupId: groupId, userId: currentUser.id
    }});
    if(!member) return res.status(403).json({message: "Forbidden"});


    const statuses = ['owner', 'co-host']
    if(statuses.includes(member.status.toLowerCase()) && member.userId === currentUser.id) {
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
            lat: findNewVenue.latitude,
            lng: findNewVenue.longitude
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

    // let convertedDate = convertDate(event.startDate)
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
        groupId: parseInt(newEvent.groupId),
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
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

router.put('/:groupId/membership', requireAuth, validateMemberCreation, async(req, res, next) => {

    const userId = req.user.id;
    const groupId = req.params.groupId;
    const {memberId, status} = req.body;

    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"})

    const member = await Membership.findOne({where: {userId : memberId}});
    if(!member) return res.status(400).json({message: "User couldn't be found"})

    const currentMember = await Membership.findOne(
         {where: {
            userId: userId, groupId: groupId
            }}
         );
    if(!currentMember) return res.status(403).json({message: "Forbidden"});

        const findMemberInGroup = await Membership.findOne({where: {userId : memberId, groupId: groupId},
        attributes: ['id', 'userId', 'groupId', 'status']});
        if(!findMemberInGroup) return res.status(404).json({message: "Membership between the user and the group does not exist"});






    const statuses = ['owner', 'co-host'];
    if(statuses.includes(currentMember.status.toLowerCase()) && findMemberInGroup.status === 'pending') {
        findMemberInGroup.set({
            status: status
        });

        findMemberInGroup.save()
        return res.json({
            id : findMemberInGroup.id,
            groupId: findMemberInGroup.groupId,
            memberId: findMemberInGroup.userId,
            status: findMemberInGroup.status
        })
    };

    if(currentMember.status.toLowerCase() === 'owner' && findMemberInGroup.status === 'member') {
        findMemberInGroup.set({
            status: status
        });

        findMemberInGroup.save()
        return res.json({
            id: findMemberInGroup.id,
            groupId: findMemberInGroup.groupId,
            memberId: findMemberInGroup.userId,
            status: status
        })
    } else {
        return res.status(403).json({message: "Forbidden"})
    }

});

router.delete('/:groupId/membership/:memberId', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;

    const group = await Group.findByPk(parseInt(groupId));
    if(!group) return res.status(404).json({message: "Group couldn't be found"});

    const user = await User.findByPk(parseInt(memberId));
    if(!user) return res.status(404).json({message: "User couldn't be found"});

    const currentMember = await Membership.findOne(
        {where: {
            userId: userId, groupId: groupId
        }}
    );

    const findMember = await Membership.findOne({where: {userId : memberId, groupId: groupId}});
    if(!findMember) return res.status(404).json({message: "Membership does not exist for this User"});

    if(currentMember.status.toLowerCase() === 'owner' || currentMember.userId === Number(memberId)) {
        findMember.destroy();
        return res.status(200).json({message: "Successfully deleted membership from group"})
    } else {
        return res.status(403).json({message: "Forbidden"})
    }

});

module.exports = router;
