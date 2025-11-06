import {createBrowserHistory} from "history";


const history = createBrowserHistory();


export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    redirect_uri: window.location.origin,
  },
  onRedirectCallback: (appState) => {
    history.push(
      appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
  }
};
