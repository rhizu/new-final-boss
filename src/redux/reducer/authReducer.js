import Cookies from "js-cookie";
import {
  LOAD_PROF,
  LOGIN_FAIL,
  LOGIN_REQ,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../action-types";

const tokenFromCookie = Cookies.get("sign-language-ai-access-token");
const userFromCookie = Cookies.get("sign-language-ai-user")
  ? JSON.parse(Cookies.get("sign-language-ai-user"))
  : null;

const initialState = {
  accessToken: tokenFromCookie || null,
  user: userFromCookie || null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQ:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...state, accessToken: action.payload, loading: false };
    case LOAD_PROF:
      return { ...state, user: action.payload, loading: false };
    case LOGIN_FAIL:
      return { ...state, error: action.payload, loading: false };
    case LOGOUT:
      return { accessToken: null, user: null, loading: false };
    default:
      return state;
  }
};
