import {createBrowserHistory} from "history";


const history = createBrowserHistory();


export const auth0Config = {
  "domain": "dev-q2n82wdt7tl0hbnm.eu.auth0.com",
  "clientId": "Phq0OjvqmLysJi6b2gARzxf7IwMPv57C",
  authorizationParams: {
    "audience": "https://dev-q2n82wdt7tl0hbnm.eu.auth0.com/api/v2/",
    redirect_uri: window.location.origin,
  },
  onRedirectCallback: (appState) => {
    history.push(
      appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
  }
};
