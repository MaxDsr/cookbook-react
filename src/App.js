import { RecipeCardsLayout } from "./recipe-cards-layout/RecipeCardsLayout";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { setErrorAlert } from "./services/store/errorAlertSlice";

function App() {
  const alertText = useSelector((state) => state.errorAlert.value);
  const dispatch = useDispatch();

  const clearAlert = () => {
    dispatch(setErrorAlert(''));
  };
  return (
    <div className="App">
      <RecipeCardsLayout/>
      <Snackbar open={!!alertText} autoHideDuration={6000} onClose={clearAlert}>
        <Alert onClose={clearAlert} severity="error" sx={{ width: '100%' }}>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
