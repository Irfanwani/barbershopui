import {
  LOADING,
  GET_ERRORS,
  FIX_FAIL,
  GET_SERVICES,
} from "./types";

import axios from "axios";
import { setConfig, tokenCheck } from "./actions";
import { showMessage } from "react-native-flash-message";

import { styles2 } from "../../styles";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

export const getServices = (id, callback) => (dispatch, getState) => {
  dispatch({
    type: LOADING,
  });
  const config = setConfig(getState);

  axios
    .get(BASE_URL + `/addservices?id=${id}`, config)
    .then((res) => {
      if (res.data.length == 0) {
        dispatch({
          type: GET_ERRORS,
        });

        showMessage({
          message: "This service provider has no service details",
          type: "default",
          icon: "info",
          position: "bottom",
          style: styles2.flashstyle2,
        });

        return;
      }

      // let result = [];
      // res.data.forEach((item) => {
      // 	let itm = `${item.service}		Rs.${item.cost}`;
      // 	result.push(itm);
      // });

      dispatch({
        type: GET_SERVICES,
        payload: res.data,
      });
      callback();
    })
    .catch((err) => {
      let check = tokenCheck(err, FIX_FAIL);
      dispatch(check);
    });
};
