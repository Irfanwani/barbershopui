import axios from "axios";
import { showMessage } from "react-native-flash-message";
import * as actions from "./types";
import { baseUrl, setConfig, tokenCheck } from "./actions";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const BASE_URL = baseUrl + "/api/haircut";

const Notification_url = Constants.expoConfig.extra.PUSH_NOTIFICATION_URL;

// fixing appointments
export const fixAppointment =
  ({ reg_username, barber, datetime, services, totalcost, seeAppointments }) =>
  (dispatch, getState) => {
    dispatch({
      type: actions.LOADING,
    });

    const config = setConfig(getState);

    const currentdatetime = new Date()
      .toString()
      .split(" ")
      .slice(0, 5)
      .join(" ")
      .split(":")
      .slice(0, 2)
      .join(":");

    const body = JSON.stringify({
      barber,
      currentdatetime,
      datetime,
      services,
      totalcost,
    });
    axios
      .post(BASE_URL + "/appointments", body, config)
      .then((res) => {
        showMessage({
          message: res.data.message,
          type: "success",
          icon: "success",
        });
        dispatch({
          type: actions.GET_ERRORS,
        });

        const config = {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        };

        const body = JSON.stringify({
          to: res.data.tokenlist,
          title: "New Appointment Fixed!",
          body: `${reg_username} fixed an appointment with you!`,
          sound: "default",
          priority: "high",
          data: { screen: "Appointments" },
        });
        axios
          .post(Notification_url, body, config)
          .then(() => {})
          .catch(() => {});

        seeAppointments();

        (async () => {
          const trigger = new Date(datetime);
          trigger.setMinutes(trigger.getMinutes() - 15);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Appointment alert!`,
              body: `You have an appointment with ${barber} after 15 Minutes`,
              data: { screen: "Appointments" },
            },
            trigger,
          });
        })();
      })
      .catch((err) => {
        let check = tokenCheck(err, actions.FIX_FAIL);
        dispatch(check);
      });
  };

// Getting appointments
export const getAppointments =
  (page_no, setEndReached = () => {}) =>
  (dispatch, getState) => {
    dispatch({
      type: actions.FETCHING,
    });
    const config = setConfig(getState);

    axios
      .get(BASE_URL + `/appointments?page_no=${page_no}`, config)
      .then((res) => {
        dispatch({
          type:
            page_no == 1
              ? actions.GET_APPOINTMENTS
              : actions.UPDATE_APPOINTMENTS,
          payload: res.data,
        });
      })
      .catch((err) => {
        if (err?.response?.status == 404) {
          setEndReached(true);
          dispatch({ type: actions.GET_ERRORS });
          return;
        }
        let check = tokenCheck(err, actions.GET_APPOINTMENTS_FAIL);
        dispatch(check);
      });
  };

// Completing/deleting appointment
export const removeAppointment =
  (type, id, refreshPage) => (dispatch, getState) => {
    dispatch({
      type: actions.LOADING,
    });

    const config = setConfig(getState);

    axios
      .delete(`${BASE_URL}/cancelappointment/${id}`, config)
      .then(() => {
        refreshPage();
        showMessage({
          message: `Appointment ${type} successfully`,
          type: "success",
          icon: "success",
        });
      })
      .catch((err) => {
        let check = tokenCheck(err, actions.GET_ERRORS);
        dispatch(check);
      });
  };

// Clearing the errors
export const removeErrors = () => ({
  type: actions.GET_ERRORS,
});

// add a rating and review
export const addReview =
  (barber, ratings, comments) => (dispatch, getState) => {
    const config = setConfig(getState);

    const body = JSON.stringify({ barber, ratings, comments });

    axios
      .post(BASE_URL + `/reviews`, body, config)
      .then(() => {})
      .catch((err) => {
        let check = tokenCheck(err, actions.GET_ERRORS);
        dispatch(check);
      });
  };

// get reviews of a barber
export const getReviews = (id) => (dispatch, getState) => {
  const config = setConfig(getState);

  axios
    .get(BASE_URL + `/reviews?barber_id=${id}`, config)
    .then((res) => {
      dispatch({
        type: actions.GET_REVIEWS,
        payload: res.data,
      });
    })
    .catch((err) => {
      let check = tokenCheck(err, actions.GET_ERRORS);
      dispatch(check);
    });
};

// delete review
export const delReview = (id, callback) => (dispatch, getState) => {
  dispatch({
    type: actions.LOADING,
  });

  const config = setConfig(getState);

  axios
    .delete(BASE_URL + "/reviews", {
      data: { id },
      ...config,
    })
    .then(() => {
      dispatch({
        type: actions.GET_ERRORS,
      });
      showMessage({
        message: "Comment removed",
        type: "info",
        icon: "info",
      });
      callback();
    })
    .catch((err) => {
      let check = tokenCheck(err, actions.GET_ERRORS);
      dispatch(check);
    });
};
