import {Auth0Provider} from "@auth0/auth0-react";
import {auth0Config} from "../auth0Config.js";


const Auth0ProviderCustom = ({children}) => {
  return (
    <Auth0Provider {...auth0Config}>
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderCustom;
