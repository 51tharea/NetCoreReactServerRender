import {createServerRenderer} from "aspnet-prerendering";
import {createMemoryHistory} from "history";
import React from "react";
import {renderToString} from "react-dom/server";
import {Helmet} from "react-helmet";
import {Provider} from "react-redux";
import {StaticRouter} from "react-router-dom";
import configureStore from "./configureStore";
import {hot} from "react-hot-loader";
import {Application} from "./src";


function renderHelmet() {
    const helmetData = Helmet.renderStatic();
    let helmetStrings = "";
    const helmetDataKeys = Object.keys(helmetData);
    helmetDataKeys.forEach(key => {
        if (helmetData.hasOwnProperty(key)) {
            helmetStrings += helmetData[key].toString();
        }
    });
    return helmetStrings;
}

const createGlobals = (global, initialReduxState, helmetStrings) => ({
    global,
    initialReduxState,
    helmetStrings,

});

export default createServerRenderer(params => {
    console.log(params);

    return new Promise((resolve, reject) => {
        //  Prepare Redux store with in-memory history
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash.
        const urlAfterBasename = params.url.substring(basename.length);
        const history = createMemoryHistory({
            initialEntries: [urlAfterBasename]
        });
        const store = configureStore(history);
        const routerContext = {};
        const App = hot(module)(Application);
        // Prepare an instance of the application
        const app = (
            <Provider store={store}>
                <StaticRouter
                    basename={basename}
                    context={routerContext}
                    location={params.location.path}>
                    <App/>
                </StaticRouter>
            </Provider>
        );
        const renderApp = () => {
            return renderToString(app);
        };

        //  If there's a redirection, just send this information back to the host application.
        if (routerContext.url) {
            resolve({
                redirectUrl: routerContext.url,
                globals: createGlobals(params.data, store.getState(), renderHelmet()),

            });

            return;
        }
        renderApp();

        params.domainTasks.then(() => {
            //  We also send the redux store state, so the client can continue execution where the server left off.
            resolve({
                html: renderApp(),
                globals: createGlobals(params.data, store.getState(), renderHelmet())
            });
        }, reject);
    });
});