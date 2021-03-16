import { USER_AUTH, USER_LOGOUT } from "../Actions/UsersActions";

const initialState = {
  userName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
      
    case USER_AUTH:
        console.log("......UserName"+action.userName)
      return {
        userName: action.userName,
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
