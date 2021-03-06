import * as api from "../api";
import { FETCH, DECODEANDFETCH } from "../constants";
export const getEvents = () => async (dispatch) => {
  try {
    const { data } = await api.fetchEvents();
    // console.log(data);
    dispatch({ type: FETCH, payload: data });
  } catch (error) {
    //console.log(error.message);
  }
};
export const decodeAndFetch = (token) => async (dispatch) => {
  try {
    const { data } = await api.decodeAndFetch(token);

    dispatch({ type: DECODEANDFETCH, payload: data });
  } catch (error) {
    //console.log(error.message);
  }
};
