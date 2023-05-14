import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";


function ViewRecipe({open}) {
  return (
    <Dialog maxWidth={'lg'}
            onClose={() => {}}
            open={false}>
      <DialogTitle>Recipe name</DialogTitle>
      <DialogContent>

      </DialogContent>
    </Dialog>
  )
}

export default ViewRecipe;
