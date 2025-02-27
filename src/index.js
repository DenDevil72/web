import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import {
  App,
  Browse,
  CategoryBrowse,
  Login,
  Logout,
  NotFound,
  Search,
  Settings,
  SettingsLoginForm,
  theme,
  guid,
  View,
} from "./components";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route
          exact
          path={"/"}
          render={(props) => <App key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/browse"}
          render={(props) => <Browse key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/browse/:category"}
          render={(props) => <CategoryBrowse key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/login"}
          render={(props) => <Login key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/logout"}
          render={(props) => <Logout key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/search/:q"}
          render={(props) => <Search key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/settings"}
          render={(props) => <Settings key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/settings/login"}
          render={(props) => <SettingsLoginForm key={guid()} {...props} />}
        />
        <Route
          exact
          path={"/view/:id"}
          render={(props) => <View key={guid()} {...props} />}
        />
        <Route
          path={""}
          render={(props) => <NotFound key={guid()} {...props} />}
        />
      </Switch>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
