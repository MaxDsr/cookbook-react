import {RecipeCardsLayout} from "./RecipeCardsLayout/index.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {useDispatch, useSelector} from "react-redux";
import {setErrorAlert} from "./services/store/errorAlertSlice.js";
import {useAuth0} from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import TopBar from "./TopBar/index.jsx";
import {useEffect, useState} from "react";
import ApiAxiosService from "./services/ApiAxiosService.js";


function Root() {
  const alertText = useSelector((state) => state.errorAlert.value);
  const dispatch = useDispatch();
  const {isLoading, user, getAccessTokenSilently, isAuthenticated} = useAuth0();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tokenIsSet, setTokenIsSet] = useState(false);

  const clearAlert = () => {
    dispatch(setErrorAlert(''));
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const data = {
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        picture: user.picture,
        auth0Id: user.sub.split("|")[1],
      };

      const recordUser = async () => {
        try {
          await ApiAxiosService.post("/recordUser", data);
        } catch (error) {
          dispatch(setErrorAlert(error?.message));
        }
      }

      const recordUserToken = async () => {
        const token = await getAccessTokenSilently();
        ApiAxiosService.setTokenCustom(token);
        await recordUser();
        setTokenIsSet(true);
      }

      recordUserToken();
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div className="App">
      <TopBar
        createRecipeButton={
          <Button variant="contained"
                  // disabled={recipesLoading} //TODO see if this is needed
                  onClick={() => setCreateDialogOpen(true)}>
            Create new recipe
          </Button>
        }
      />
      {isAuthenticated && tokenIsSet && <RecipeCardsLayout createDialogOpen={createDialogOpen}/>}
      <Snackbar open={!!alertText} autoHideDuration={6000} onClose={clearAlert}>
        <Alert onClose={clearAlert} severity="error" sx={{width: '100%'}}>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Root;
