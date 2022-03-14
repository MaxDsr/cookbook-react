import './App.scss';
import {RecipeCardsLayout} from "./recipe-cards-layout/RecipeCardsLayout";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

function App() {
  const [alertText, setAlertText] = useState(null);
  return (
    <div className="App">
      <RecipeCardsLayout/>
      <Snackbar open={!!alertText} autoHideDuration={6000} onClose={() => {}}>
        <Alert onClose={() => {}} severity="error" sx={{ width: '100%' }}>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
