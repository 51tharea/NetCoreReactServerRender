import {ConnectedRouter} from "connected-react-router";
import {createBrowserHistory} from "history";
import React from "react";
import {hydrate} from "react-dom";
import {Provider} from "react-redux";
import {hot} from "react-hot-loader";
import configureStore from "./configureStore";
import {Application} from "./src";
import "./styles/index.css";


const history = createBrowserHistory();


const initialState = window.initialReduxState;


const store = configureStore(history, initialState);

const App = hot(module)(Application);

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

function renderApp() {
    hydrate(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App/>
            </ConnectedRouter>
        </Provider>,
        rootElement
    );
}

renderApp();