import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
// import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// import { USER_LOADING } from "./types";


//Add POI
export const addPOI = (newPOI, history) => dispatch => {
  console.log(newPOI)
    axios
      .post("/api/pois/add", newPOI)
      .then(res => history.push("/dashboard"))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

//Get categories
export const getCategories = () => async (dispatch) => {
  let categories =  await axios
    .get("/api/categories")
    .then(res => categories = res.data)
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
    // console.log(categories)
    return categories;
  }



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
