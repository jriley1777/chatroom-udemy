import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import firebase from './utils/firebase/firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducers/index';

import * as Constants from './constants/index';
import * as Selectors from "./selectors/index";

import { setUser, clearUser } from "./actions/index";
import App from './components/App/App';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import MissingRoute from './components/Routing/MissingRoute/MissingRoute';
import Spinner from './components/Spinner/Spinner';

const store = createStore(
  rootReducer /* preloadedState, */,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Root = props => {
    const { setUser, clearUser, history, isUserLoading } = props;
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              setUser(user);
              history.push(Constants.ROUTES.INDEX);
            } else {
              history.push(Constants.ROUTES.LOGIN);
              clearUser();
            }
        })
    }, [setUser, clearUser, history])
    return isUserLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path={Constants.ROUTES.INDEX} component={App} />
        <Route exact path={Constants.ROUTES.LOGIN} component={Login} />
        <Route exact path={Constants.ROUTES.REGISTER} component={Register} />
        <Route path={Constants.ROUTES.INDEX} component={MissingRoute} />
      </Switch>
    );
}

const mapStateToProps = state => ({
    isUserLoading: Selectors.getUserIsLoading(state)
});

const mapDispatchToProps = { setUser, clearUser };

const RootWithAuth = withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
