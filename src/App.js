import './App.scss';
import {RecipeCardsLayout} from "./recipe-cards-layout/RecipeCardsLayout";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {useEffect, useState} from "react";
import {StoreService} from "./services/StoreService";

function App() {
  const [alertText, setAlertText] = useState(null);

  useEffect(() => {
    const unsubscribeFromStore = StoreService.storeSubscribe(() => {
      const errorAlert = StoreService.getStoreState()?.errorAlert;
      if (errorAlert.hasChanges) {
        setAlertText(errorAlert.data);
      }
    });
    return () => {
      unsubscribeFromStore();
    }
  }, []);

  const clearAlert = () => {
    StoreService.setErrorAlert(null);
    setAlertText(false);
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
