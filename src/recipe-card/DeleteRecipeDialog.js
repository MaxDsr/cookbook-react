import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { deleteRecipe } from "../services/store/RecipesSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const DeleteRecipeDialog = (props) => {
  const [actionInProgress, setActionInProgress] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    props.onClose();
  };

  const handleSubmit = () => {
    setActionInProgress(true);
    const onActionEnded = () => {
      setActionInProgress(false);
      handleClose();
    };
    dispatch(deleteRecipe(props.itemId, onActionEnded));
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogContent>
        <Alert severity="error" sx={{ width: '100'}}>Are you sure you want to delete this recipe ?</Alert>
      </DialogContent>
      <DialogActions>
        { actionInProgress ? <CircularProgress/> : ''}
        <Button disabled={actionInProgress} onClick={handleClose}>Cancel</Button>
        <Button disabled={actionInProgress} autoFocus color="error" onClick={handleSubmit}>Delete recipe</Button>
      </DialogActions>
    </Dialog>
  );
};
