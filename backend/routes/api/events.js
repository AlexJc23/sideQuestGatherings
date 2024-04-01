
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Attendee, GroupImage, EventImage, Membership } = require('../../db/models');
// const { check } = require('express-validator');
const { validateEventCreation } = require('../../utils/validateChecks')

// const { handleValidationErrors } = require('../../utils/validation.js')
const router = express.Router();


router.get('/', async (req, res) => {
    const allEvents = [];
    const events = await Event.findAll({
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

        allEvents.push({
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            startDate: event.startDate,
            endDate: event.endDate,
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
                attributes: ['id', 'name', 'city', 'state']
            },
            {model: Venue,
            attributes: ['id', 'city', 'state']
            }
        ]
    });

    if(!events) return res.status(404).json({"message": "Event couldn't be found"})
    // for (const event of events) {
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
            type: events.type,
            startDate: events.startDate,
            endDate: events.endDate,
            numAttending: attending,
            Group: events.Group,
            Venue: events.Venue,
            previewImage: events.EventImages
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

    const eventToUpdate = await Event.findByPk(parseInt(eventId), {attributes: { exclude: ['updatedAt', 'createdAt'] }});
    if(!eventToUpdate) return res.status(404).json({message: "Event couldn't be found"})

    const venue = await Venue.findByPk(parseInt(venueId));
        if(!venue) return res.status(404).json({message: "Venue couldn't be found"});


    const member = await Membership.findOne({where: {
        groupId: eventToUpdate.groupId, userId: currentUser.id
    }});

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
    return res.json(eventToUpdate);
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

    if((member.status.toUpperCase() === 'OWNER' || member.status.toUpperCase() === 'CO-HOST')) {
            event.destroy()
            res.json({message: "Successfully deleted"})
    } else {
        return res.status(403).json({message: "Forbidden"});
    }
})

module.exports = router;
