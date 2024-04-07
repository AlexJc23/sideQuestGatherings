
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Attendee, GroupImage, EventImage, Membership } = require('../../db/models');
const {convertDate} = require('../../utils/helpFunc');


const { validateEventCreation, validateAttendanceStatus, validateQueries } = require('../../utils/validateChecks')


const router = express.Router();


router.get('/', validateQueries, async (req, res) => {
    let { page, size, name, type, startDate } = req.query;

    const allEvents = [];

    page = Number(page);
    size = Number(size);

    if (isNaN(page) || page < 1 ) page = 1;
    if (isNaN(size) || size < 1 || size > 20) size = 20;

    const where = {};
    const pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    if(name && name !== " ") {
        where.name =
            {[Op.like]: `%${name}%`}
        }

    if(type && type !== " ") {
        where.type = type
    };

    if(startDate && startDate !== "") {
        where.startDate = startDate
    };

    const events = await Event.findAll({where,
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
        ],
        ...pagination
    });


    for (const event of events) {
        const attending = await Attendee.count({
            where: {
                eventId: event.id
            }

        });

        allEvents.push({
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


router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;


    const events = await Event.findByPk(parseInt(eventId),{
        include: [
            {model: EventImage,
                attributes: ['id', 'imageUrl', 'preview'],
            },
            {model: Group,
                attributes: ['id', 'name', 'private','city', 'state']
            },
            {model: Venue,
            attributes: {exclude: ['groupId', 'createdAt', 'updatedAt']}
            }
        ]
    });

    if(!events) return res.status(404).json({"message": "Event couldn't be found"})
        const attending = await Attendee.count({
            where: {
                eventId: events.id
            }

        });

        eventByPk = {
            id: events.id,
            groupId: events.groupId,
            venueId: events.venueId,
            name: events.name,
            description: events.description,
            type: events.type,
            capacity: events.capacity,
            price: events.price,
            startDate: convertDate(events.startDate),
            endDate: convertDate(events.endDate),
            numAttending: attending,
            Group: events.Group,
            Venue: {
                id: events.Venue.id,
                address: events.Venue.address,
                city: events.Venue.city,
                state: events.Venue.state,
                lat: events.Venue.latitude,
                lng: events.Venue.longitude
            },
            EventImages: events.EventImages
        };
    // }
        return res.json(eventByPk)
});

router.post('/:eventId/images', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const currentUser = req.user;
    const {url, preview} = req.body;

    const event = await Event.findByPk(parseInt(eventId));
    //event doesnt exist send error 404 Event couldn't be found
    if(!event) return res.status(404).json({message: "Event couldn't be found"});


    const member = await Membership.findOne({where: {
            groupId: event.groupId, userId: currentUser.id
        }});
    if(!member) return res.status(403).json({message:'Forbidden'})

    const attendee = await Attendee.findOne({where: {
        userId: currentUser.id,
        eventId: eventId,
        status: 'Attending'
    }})
    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST') || attendee) {
        const eventImg = await EventImage.create({
            eventId: eventId,
            imageUrl: url,
            preview: preview
        });

        const confirmedImage = await EventImage.findByPk(eventImg.id);
        return res.json(confirmedImage)
    } else {
        return res.status(403).json({message:'Forbidden'})
    }

});

router.put('/:eventId', requireAuth, validateEventCreation, async (req, res) => {
    const eventId = req.params.eventId;
    const currentUser = req.user;

    const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body;

    const eventToUpdate = await Event.findByPk(parseInt(eventId));
    if(!eventToUpdate) return res.status(404).json({message: "Event couldn't be found"})

    const venue = await Venue.findByPk(parseInt(venueId));
        if(!venue) return res.status(404).json({message: "Venue couldn't be found"});


    const member = await Membership.findOne({where: {
        groupId: eventToUpdate.groupId, userId: currentUser.id
    }});
    if(!member) return res.status(403).json({message:'Forbidden'});

     eventToUpdate.set({
        venueId: venueId,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: startDate,
        endDate: endDate
    });

    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST')) {
    eventToUpdate.save()

    const confirmedEvent = {
        groupId: eventToUpdate.groupId,
        venueId: eventToUpdate.venueId,
        name: eventToUpdate.name,
        type: eventToUpdate.type,
        capacity: eventToUpdate.capacity,
        price: eventToUpdate.price,
        description: eventToUpdate.description,
        startDate: convertDate(startDate),
        endDate: convertDate(endDate)
    }

    return res.json(confirmedEvent);
    } else {
        res.status(403).json({message: "Forbidden"})
    }
});

router.delete('/:eventId', requireAuth, async (req, res) => {
    const currentUser = req.user;
    const eventId = req.params.eventId;

    const event = await Event.findByPk(parseInt(eventId));

    if(!event) return res.status(404).json({message: "Event couldn't be found"});


    const member = await Membership.findOne({where: {
        groupId: event.groupId, userId: currentUser.id
    }});

    if(!member) return res.status(403).json({message:'Forbidden'});

    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST')) {
            event.destroy()
            res.json({message: "Successfully deleted"})
    } else {
        return res.status(403).json({message: "Forbidden"});
    }
});

router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId;
    const userCurrent = req.user;

    const attendingUsers = [];


    const event = await Event.findByPk(parseInt(eventId));
    if(!event) return res.status(404).json({message: "Event couldn't be found"})

    const currentUser = await Membership.findOne({where: {userId: userCurrent.id, groupId: event.groupId}})


    let attendees;
    if (!currentUser || currentUser.status.toUpperCase() === 'PENDING') {
        // If current user is not a member yet or is pending, return all non-pending members
        attendees = await Attendee.findAll({
            where: {
                eventId: eventId,
                status: { [Op.ne]: 'pending' }
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
    } else {
        // If current user is owner or co-host, return all members
        attendees = await Attendee.findAll({
            where: {
                eventId: eventId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
    }

    for (const attend of attendees) {
        attendingUsers.push({
            id: attend.User.id,
            firstName: attend.User.firstName,
            lastName: attend.User.lastName,
            Membership: {
                status: attend.status
            }
        });
    };

    return res.status(200).json({ Attendees: attendingUsers });

});

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const memberId = req.user.id;



    const event = await Event.findByPk(parseInt(eventId));
    if(!event) return res.status(404).json({message: "Event couldn't be found"})

    const currentUser = await Membership.findOne({where: {userId: memberId, groupId: event.groupId}})
    const attending = await Attendee.findOne({where: {userId: memberId, eventId: eventId}});
    // return res.json(currentUser)
    if(!currentUser) return res.status(403).json({message: "Forbidden"});



    if(!attending && currentUser) {
        const newAttendy = await Attendee.create({
            userId: memberId,
            eventId: eventId,
            status: 'pending'
        });

        return res.status(200).json({
            userId: newAttendy.userId,
            status: newAttendy.status
        });
    }
    if(attending.status.toLowerCase() === 'pending') return res.status(400).json({message: "Attendance has already been requested"});
    if(attending.status.toLowerCase() === 'attending') return res.status(400).json({message: "User is already an attendee of the event"});

});
router.put('/:eventId/attendance', requireAuth, validateAttendanceStatus, async (req, res) => {
    const eventId = req.params.eventId;
    const memberId = req.user.id;
    const {userId, status} = req.body;

    const event = await Event.findByPk(parseInt(eventId));
    if(!event) return res.status(404).json({message: "Event couldn't be found"});

    const currentUser = await Membership.findOne({where: {userId: memberId, groupId: event.groupId}});
    if(!currentUser) return res.status(404).json({message: "User couldn't be found"});

    const attending = await Attendee.findOne({where: {userId: userId, eventId: eventId},
    attributes: ['id', 'userId', 'eventId', 'status']});

    if(!attending) return res.status(404).json({message: "Attendance between the user and the event does not exist"});

    const statuses = ['owner', 'co-host'];
    const attendingStatus = ['pending', 'attending', 'waitlist'];
    if(statuses.includes(currentUser.status.toLowerCase()) && attendingStatus.includes(attending.status.toLowerCase()) ) {
        attending.set({
            status: status
        });

        attending.save()
    } else {
        return res.status(403).json({message: "Forbidden"})
    };

    return res.json({
        id:  attending.id,
        eventId: attending.eventId,
        userId: attending.userId,
        status: attending.status
    });


});

router.delete('/:eventId/attendance/:userId', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const memberId = req.user.id;
    const userId = req.params.userId;


    const event = await Event.findByPk(parseInt(eventId));
    if(!event) return res.status(404).json({message: "Event couldn't be found"});

    const currentUser = await Membership.findOne({where: {userId: memberId, groupId: event.groupId}});
    if(!currentUser) return res.status(404).json({message: "User couldn't be found"});
    const attending = await Attendee.findOne({where: {userId: userId, eventId: eventId}});
    // return res.json(currentUser.status)

    if(!attending) return res.status(404).json({message: "Attendance between the user and the event does not exist"});


    if((currentUser.status.toLowerCase() === 'owner' || currentUser.status.toLowerCase() === 'co-host') || currentUser.userId === Number(memberId)) {
        attending.destroy();
        return res.status(200).json({message: "Successfully deleted attendance from event"})
    } else {
        return res.status(403).json({message: "Forbidden"})
    }
});



module.exports = router;
