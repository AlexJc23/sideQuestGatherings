import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

const ALL_GROUPS = 'groups/ALL_GROUPS';
const ONE_GROUP = 'groups/ONE_GROUP';
const ADD_GROUP = 'groups/ADD-GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP';

const loadGroups = (payload) => ({
    type: ALL_GROUPS,
    payload,
});
const loadGroup = (payload) => ({
    type: ONE_GROUP,
    payload,
});

const addGroup = (payload) => ({
    type: ADD_GROUP,
    payload
});

const deleteGroup = (groupId) => ({
    type: DELETE_GROUP,
    groupId
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
        dispatch(loadGroup(data))
        return data
    } else {
        return res;
    }
}

export const createGroup = (payload) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        return await error.json();
    }
    const data = await response.json();

    let image = {
            groupId: data.id,
            url: payload.url,
            preview: true
    }
    try {
        response = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image),
        });
    } catch (error) {
        return await error.json();
    }

    // console.log(data)
    dispatch(addGroup(data));
    return data;
}

export const changeGroupDetails = (payload, groupId) => async (dispatch) => {
    let response;
    try {
        response = await csrfFetch(`/api/groups/${groupId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        return await error.json();
    }
    const data = await response.json();

    let image = {
            groupId: data.id,
            url: payload.url,
            preview: true
    }
    try {
        response = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(image),
        });
    } catch (error) {
        return await error.json();
    }
    dispatch(addGroup(data));
    return data;
};

export const removeGroup = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })
}

// custom selectors
export const selectorGroups = (state) => state.groups.allGroups;

export const groupDetailSelector = (groupId) => createSelector(
    selectorGroups,
    (group) => group[groupId]
);




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
        case ADD_GROUP: {
            const newGroup = action.payload;
            return {
                ...state,
                allGroups: {
                    ...state.allGroups,
                    [newGroup.id]: newGroup
                }
            };
        }
        case DELETE_GROUP: {
            const newState = {...state};
            delete newState.allGroups[action.groupId];
            return newState
        }
        default:
            return state;
    }
};

export default groupsReducer;
