import { ADD_MESSAGE, SET_MESSAGES } from "../Actions/ChatActions";

const initialState = {
  messages: [],
};

export default (state = initialState, actions) => {
  switch (actions.type) {
    case ADD_MESSAGE:
      return { ...state, messages: state.messages.concat(actions.message) };

    case SET_MESSAGES:
      return { messages: actions.messages };
    default:
      return { state };
  }
};
