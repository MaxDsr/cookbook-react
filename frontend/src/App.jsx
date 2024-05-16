import Auth0ProviderCustom from "./Auth0ProviderCustom/index.jsx";
import Root from "./Root.jsx";

function App() {
  return (
      <Auth0ProviderCustom>
        <Root/>
      </Auth0ProviderCustom>
  );
}

export default App;
