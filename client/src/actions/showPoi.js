import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

//get POI
export const showPois = () => dispatch => {
 console.log("sto in showpois")
    axios
      .get("/api/pois/get")
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };


// Set logged in user
export const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };

  // Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };
