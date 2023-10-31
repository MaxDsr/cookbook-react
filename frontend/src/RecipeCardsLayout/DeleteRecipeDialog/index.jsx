import {useState} from "react";
import {useDispatch} from "react-redux";
import {deleteRecipe} from "../../services/store/RecipesSlice";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";


function DeleteRecipeDialog(props) {
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

export default DeleteRecipeDialog;
