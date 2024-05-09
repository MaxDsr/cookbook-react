import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {useDispatch, useSelector} from "react-redux";
import {setErrorAlert} from "./services/store/errorAlertSlice";
import {RecipeCardsLayout} from "./RecipeCardsLayout";
import {Auth0Provider} from "@auth0/auth0-react";
import {auth0Config} from "./auth0Config.js";

function App() {
  const alertText = useSelector((state) => state.errorAlert.value);
  const dispatch = useDispatch();

  const clearAlert = () => {
    dispatch(setErrorAlert(''));
  };
  return (
    <div className="App">
      <Auth0Provider {...auth0Config}>
        <RecipeCardsLayout/>
        <Snackbar open={!!alertText} autoHideDuration={6000} onClose={clearAlert}>
          <Alert onClose={clearAlert} severity="error" sx={{width: '100%'}}>
            {alertText}
          </Alert>
        </Snackbar>
      </Auth0Provider>
    </div>
  );
}

export default App;
