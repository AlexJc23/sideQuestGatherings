import { csrfFetch } from "./csrf";

const ALL_EVENTS = 'events/ALL_EVENTS';
const ONE_EVENT = 'events/ONE_EVENT';

const loadEvents = (payload) => ({
    type: ALL_EVENTS,
    payload
});

const loadEvent = (payload) => ({
    type: ONE_EVENT,
    payload
});

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
        default:
            return state;
    }
};

export default eventsReducer;
