import { csrfFetch } from "./csrf";

const ALL_GROUPS = 'groups/ALL_GROUPS';
const ONE_GROUP = 'groups/ONE_GROUP'

const loadGroups = (payload) => ({
    type: ALL_GROUPS,
    payload,
});
const loadGroup = (payload) => ({
    type: ONE_GROUP,
    payload,
});



//get all groups from data
export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch(`/api/groups`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadGroups(data.Groups));
        return data;
    }
    return res;
};



//get details of specific group
export const groupDetails = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'GET'
    });

    if(res.ok) {
        const data = await res.json();
        console.log('did it work?   ', data)
        dispatch(loadGroup(data))
    }
    return res;
}

const initialState = { allGroups: {}, currentGroup: {} };  // initial state

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
        case ONE_GROUP: {
            return {
                ...state,
                currentGroup: action.payload  
            };
        }
        default:
            return state;
    }
};

export default groupsReducer;
