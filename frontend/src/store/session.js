import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
// const ADD_USER = "session/addUser";


const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};


const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// const addUser = (payload) => {
//   return {
//     type: ADD_USER,
//     payload
//   }
// }

// login user with provided creds
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(setUser(data.user));
  }
  return res;
};

//restore current user cookies
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/session')

  if(res.ok) {
    const data = await res.json();
    dispatch(setUser(data.user))
    return data
  }
  return res;
}

// signup use using payload
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  if(res.ok) {
    const data = await res.json();

    dispatch(setUser(data.user));
  }
  return res;
};

//logout the user and the cookies
export const logoutUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE'
  });

  if(res.ok) {
    // const data = await res.json();
    dispatch(removeUser())
    return res
  }

}


const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
