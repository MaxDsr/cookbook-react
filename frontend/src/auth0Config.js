import {createBrowserHistory} from "history";


const history = createBrowserHistory();


export const auth0Config = {
  "domain": "dev-42ovpq2mja2h0nqq.us.auth0.com",
  "clientId": "osfej91vbYVhyiJaI8bLqYSdwnBbAWvQ",
  authorizationParams: {
    "audience": "https://dev-42ovpq2mja2h0nqq.us.auth0.com/api/v2/",
    redirect_uri: window.location.origin,
  },
  onRedirectCallback: (appState) => {
    history.push(
      appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
  }
};
