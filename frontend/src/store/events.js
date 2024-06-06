import { csrfFetch } from "./csrf";

const ALL_EVENTS = 'events/ALL_EVENTS';

const loadEvents = (payload) => ({
    type: ALL_EVENTS,
    payload
});


export const getEvents = () => async (dispatch) => {
    const res = await csrfFetch('/api/events', {
        method: 'GET'
    });

    if(res.ok) {
        const data = await res.json();
        dispatch(loadEvents(data.Events))
        return data
    }
    return res;
};

const initialState = {allEvents: {}, currentEvents: {}};

const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ALL_EVENTS: {
            const allEvents = {};
            action.payload.forEach((event) => {
                allEvents[event.id] = event;
            });
            return {
                ...state,
                allEvents
            }
        }
        default:
            return state;
    }
}

export default eventsReducer;
