import { csrfFetch } from "./csrf";

const ALL_GROUPS = 'groups/ALL_GROUPS';

const loadGroups = (payload) => ({
    type: ALL_GROUPS,
    payload,
});

export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch(`/api/groups`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadGroups(data.Groups));
        return data;
    }
    return res;
};

const initialState = { allGroups: {} };  // initial state

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_GROUPS: {
            const allGroups = {};
            action.payload.forEach((group) => {
                allGroups[group.id] = group;  // group assignment
            });
            return {
                ...state,
                allGroups,
            };
        }
        default:
            return state;
    }
};

export default groupsReducer;
