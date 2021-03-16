import { CREATE_USER_OTP, GET_USER_OTP } from "../Actions/UsersActions";

const initialState = {
  OTP: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_OTP:
      let updatedOTP = null;

      console.log("Create User OTP dispatched");

      let match = state.OTP.findIndex(
        (element) => element.title === action.title
      );

      if (match >= 0) {
        state.OTP[match].count = state.OTP[match].count + action.count;
        state.OTP[match].userOTP = state.OTP[match].userOTP.concat(
          action.userOTP
        );
        console.log(state)

        return {
          ...state,
        };
      } else {
        updatedOTP = {
          title: action.title,
          count: action.count,
          userOTP: action.userOTP,
        }
        console.log(state)
        return {
          ...state,
          OTP: state.OTP.concat(updatedOTP),
        };
        
      }

    case GET_USER_OTP:
      let otp = action.data.map((element) => {
        return {
          title: element.title,
          count: element.count,
          userOTP: element.userOTP,
        };
      });

      return {
        OTP: otp,
      };

    default:
      return state;
  }
};
