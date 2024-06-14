import { csrfFetch } from "./csrf";

const ALL_EVENTS = 'events/ALL_EVENTS';
const ONE_EVENT = 'events/ONE_EVENT';
const ADD_EVENT = 'events/ADD_EVENT';

const loadEvents = (payload) => ({
    type: ALL_EVENTS,
    payload
});

const loadEvent = (payload) => ({
    type: ONE_EVENT,
    payload
});

const addEvent = (payload) => ({
    type: ADD_EVENT,
    payload
});


// thunks
export const getEvents = () => async (dispatch) => {
    const res = await csrfFetch('/api/events', {
        method: 'GET'
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadEvents(data.Events));
        return data;
    }
    return res;
};

export const eventDetails = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'GET'
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadEvent(data));
        return data;
    }
    return res;
};

export const createEvent = (payload,groupId) => async (dispatch) => {
    let res;
    try {
        res = await csrfFetch(`/api/groups/${groupId}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

    } catch (error) {
        return await error.json();
    }

    const data = await res.json();
    console.log('datatattata   ', data)
    let image = {
        eventId: data.id,
            imageUrl: payload.url,
            preview: true
    }
    try {
        res = await csrfFetch(`/api/events/${data.id}/images`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image),
        });
    } catch (error) {
        return await error.json()
    }
    dispatch(addEvent(data));
    return data;
}


// selectors.js
import { createSelector } from 'reselect';

export const selectEvents = (state) => state.events.allEvents;

export const eventsArrSelector = createSelector(
    selectEvents,
    (events) => Object.values(events)
);

export const selectEventDetails = (state) => state.events.currentEvents;

export const eventDetailSelector = (eventId) => createSelector(
    selectEventDetails,
    (events) => events[eventId]
);

// reducer.js
const initialState = { allEvents: {}, currentEvents: {} };

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_EVENTS: {
            const allEvents = {};
            action.payload.forEach((event) => {
                allEvents[event.id] = event;
            });
            return {
                ...state,
                allEvents
            };
        }
        case ONE_EVENT: {
            const event = action.payload;
            return {
                ...state,
                currentEvents: {
                    ...state.currentEvents,
                    [event.id]: event
                }
            };
        }
        case ADD_EVENT: {
            const newEvent = action.payload;
            return {
                ...state,
                allEvents: {
                    ...state.allEvents,
                    [newEvent.id]: newEvent
                }
            };
        }
        default:
            return state;
    }
};

export default eventsReducer;
