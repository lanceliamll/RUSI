import React, { Component, Fragment } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadUser } from "./actions/authActions";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Navigation from "./components/layout/Navigation";
import RouteComponent from "./components/routing/RouteComponent";
import setAuthToken from "./helpers/setAuthToken";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends Component {
  componentDidMount() {
    if (localStorage.token) {
      store.dispatch(loadUser());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Fragment>
              <Navigation />
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route component={RouteComponent} />
              </Switch>
              <Footer />
            </Fragment>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
