import {
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_FAIL,
  LOGOUT_SUCCESS,
  UPDATE_APPOINTMENTS,
} from "../actions/types";

initialState = {
  appointments: null,
};

export default appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
      };
    case UPDATE_APPOINTMENTS:
      return {
        ...state,
        appointments: [...state.appointments, ...action.payload],
      };
    case LOGOUT_SUCCESS:
    case GET_APPOINTMENTS_FAIL:
      return {
        ...state,
        appointments: null,
      };
    default:
      return state;
  }
};
