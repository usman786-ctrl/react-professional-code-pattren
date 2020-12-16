import { App } from "../constants/app";
import {
  ADVANCE_SEARCH_MENU_KEY,
  RETURN_SEARCH_MENU_KEY,
} from "../config/config";

const initialState = {
  appError: "",
  isUserAuthenticated: true,
  isLoading: 0,
  authTime: new Date().getTime(), // timestamp
  SHIPMENTS_LIST_PAGE_SIZE: 10,
  advanceSearchFromHeader: "",
  leftMenuList: [],
  lastActiveList: {},
};

function AppReducer(state = initialState, action) {
  switch (action.type) {
    case App.UPDATE_APP_ERROR:
      return {
        ...state,
        appError: action.payload,
        isLoading: false,
      };

    case App.ADD_TO_LEFT_MENU:
      const allLeftList = [...state.leftMenuList];
      const index = allLeftList.findIndex(
        (res) => res.OrderNo == action.payload.OrderNo
      );
      if (index == -1) {
        return {
          ...state,
          leftMenuList: [...state.leftMenuList, action.payload],
        };
      } else {
        return {
          ...state,
        };
      }

    case App.UPDATE_ADVANCE_MENU_URL:
      return {
        ...state,
        leftMenuList: [
          ...state.leftMenuList.map((res) => {
            if (res.OrderNo == ADVANCE_SEARCH_MENU_KEY) {
              res.url = action.payload;
            }
            return res;
          }),
        ],
      };

    case App.UPDATE_RETURN_SEARCH_MENU_URL:
      return {
        ...state,
        leftMenuList: [
          ...state.leftMenuList.map((res) => {
            if (res.OrderNo == RETURN_SEARCH_MENU_KEY) {
              res.url = action.payload;
            }
            return res;
          }),
        ],
      };

    case App.REMOVE_FROM_LEFT_TAB:
      return {
        ...state,
        leftMenuList: [
          ...state.leftMenuList.filter((res) => res.OrderNo != action.payload),
        ],
      };

    case App.LAST_ACTIVE_LIST:
      return {
        ...state,
        lastActiveList: action.payload,
      };

    case App.GOTO_SEARCH_ADVANCE:
      return {
        ...state,
        advanceSearchFromHeader: action.payload,
      };

    case App.CHANGE_PAGE_LIMIT:
      return {
        ...state,
        SHIPMENTS_LIST_PAGE_SIZE: action.payload,
      };

    case App.UPDATE_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case App.UPDATE_USER_AUTHENTICATION_STATE:
      return {
        ...state,
        isUserAuthenticated: action.payload,
        isLoading: false,
      };

    case App.UPDATE_AUTH_TIME:
      return {
        ...state,
        authTime: action.payload,
      };

    default:
      return state;
  }
}

export default AppReducer;
