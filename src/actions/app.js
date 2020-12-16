import {
  API_CONSTANTS,
  API_ROOT,
  URI,
  TOASTER_TIMEOUT,
} from "../../src/config/config";
import { toaster } from "../config/util";
import { App } from "../constants/app";
import store from "../store/store";
import { push } from "connected-react-router";

export const removeFromLeftTab = (id) => {
  return (dispatch) => {
    dispatch({
      type: App.REMOVE_FROM_LEFT_TAB,
      payload: id,
    });
  };
};

export const updateAdvanceLeftMenuUrl = (url) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_ADVANCE_MENU_URL,
      payload: url,
    });
  };
};

export const updateReturnSearchLeftMenuUrl = (url) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_RETURN_SEARCH_MENU_URL,
      payload: url,
    });
  };
};

export const addToLeftMenu = (data, lastActiveList) => {
  return (dispatch) => {
    dispatch({
      type: App.ADD_TO_LEFT_MENU,
      payload: data,
    });
    dispatch({
      type: App.LAST_ACTIVE_LIST,
      payload: lastActiveList,
    });
  };
};

export const advanceSearchValue = (value) => {
  return (dispatch) => {
    dispatch({
      type: App.GOTO_SEARCH_ADVANCE,
      payload: value,
    });
    setTimeout(() => {
      dispatch({
        type: App.GOTO_SEARCH_ADVANCE,
        payload: "",
      });
    }, 100);
  };
};

export const getUserDetails = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  if (userDetails) {
    return userDetails;
  } else {
    redirectUserToLoginPage();
  }
};

export const redirectUserToLoginPage = () => {
  // store.dispatch(updateUserAuthenticationState(false));
  localStorage.clear();
  if (!window.showingError) {
    toaster.show("User Session Timeout Out!", toaster.ERROR);
  }
  window.showingError = true;
  setTimeout(() => {
    window.showingError = false;
  }, TOASTER_TIMEOUT);
  store.dispatch(push("/login"));
};

export const updateUserAuthenticationState = (state) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_USER_AUTHENTICATION_STATE,
      payload: state,
    });
  };
};

export const changePageLimit = (limit) => {
  return (dispatch) => {
    dispatch({
      type: App.CHANGE_PAGE_LIMIT,
      payload: limit,
    });
  };
};

export const updateIsLoading = (state) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_IS_LOADING,
      payload: state,
    });
  };
};

export const updateAppError = (error) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_APP_ERROR,
      payload: error,
    });
  };
};

export const updateAuthTime = (time) => {
  return (dispatch) => {
    dispatch({
      type: App.UPDATE_AUTH_TIME,
      payload: time,
    });
  };
};

export const handleAppError = (error) => {
  // if user is unauthenticated redirect to login
  if (
    error &&
    error.ErrorCode == API_CONSTANTS.UNAUTHENTICATED_USER_ERROR_CODE
  ) {
    redirectUserToLoginPage();
  } else if (typeof error == "string") {
    store.dispatch({
      type: App.UPDATE_APP_ERROR,
      payload: error,
    });
  }
};

export const httpProcessor = async (URL, options) => {
  
  return new Promise(async (resolve, reject) => {
    const isUserAuthenticated = store.getState().AppDetail.isUserAuthenticated;
    const appError = store.getState().AppDetail.appError;
    // only call api if user is authenticated, except login api
    if (isUserAuthenticated || API_ROOT + URI.LOGIN_USER == URL) {
      if (!options.doNotHandleLoader) {
        store.dispatch(updateIsLoading(true));
      }

      fetch(URL, {
        method: options.method || "GET",
        body: options.body || undefined,
        headers: options.headers || {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          const contentType = res.headers.get("content-type");

          if (contentType) {
            if (contentType.indexOf("application/json") !== -1) {
              return res.json();
            } else {
              return res.text();
            }
          }
          resolve();
        })
        .then((data) => {
          // empty app error
          if (appError) {
            handleAppError("");
          }

          console.log("api data", data);

          if (data) {
            if (data.errors && data.errors.length > 0) {
              handleAppError(data.errors[0]);
              reject(data.errors[0]);
            } else {
              store.dispatch(updateAuthTime(new Date().getTime()));
              resolve(data);
            }
          }

          store.dispatch(updateIsLoading(false));
        })
        .catch((err) => {
          // update app error
          if (!appError) {
            handleAppError(API_CONSTANTS.COMMON_ERROR);
            // if (!window.showingError) {
            //   toaster.show(API_CONSTANTS.COMMON_ERROR, toaster.ERROR);
            // }
            // window.showingError = true;
            // setTimeout(() => {
            //   window.showingError = false;
            // }, TOASTER_TIMEOUT);
          }
          store.dispatch(updateIsLoading(false));
          reject(err);
        });
    }
  });
};
