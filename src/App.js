import { ThemeProvider } from "@material-ui/core";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "../src/views/Login/Login";
import "./App.css";
import ResponsiveDrawer from "./components/ResponsiveDrawer/ResponsiveDrawer";
import { history } from "./store/store";
import theme from "./theme";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

const App = () => {
  return (
    <div className="appBody">
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={ResponsiveDrawer} />
            </Switch>
          </React.Suspense>
        </ConnectedRouter>
        <ToastContainer />
      </ThemeProvider>
    </div>
  );
};

export default App;
