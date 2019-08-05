import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AdminSettings from "../../components/admin/AdminSettings";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";
import NotFound from "../../components/NotFound";
import Products from "../../components/products/Products";
import PrivateRoute from "../../components/routing/PrivateRoute";

export default class RouteComponent extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/products" component={Products} />
          <PrivateRoute exact path="/adminsettings" component={AdminSettings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
