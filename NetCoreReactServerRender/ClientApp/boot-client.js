import {ConnectedRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import React from "react";
import {hydrate} from "react-dom";
import {Provider} from "react-redux";
import {hot} from "react-hot-loader";
import configureStore from "./configureStore";
import {Application} from "./src";

// Create browser history to use in the Redux store.
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialState;

// Configure store with initial state that comes from server-side rendered html and newly created history
const store = configureStore(history, initialState);

const App = hot(module)(Application);

// Renders app with hydrate so it can go on with the values where server left off
function renderApp() {
    hydrate(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App/>
            </ConnectedRouter>
        </Provider>,
        document.getElementById("react-app")
    );
}

renderApp();