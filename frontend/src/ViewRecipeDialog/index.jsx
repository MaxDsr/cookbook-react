import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Image from "mui-image";
import {Grid, useMediaQuery, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Styled from "./styles";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";

function ViewRecipeDialog({recipeId, open, onClose, onEdit, onDelete}) {

  const theme = useTheme();
  const matchesSmMediaQuery = useMediaQuery(theme.breakpoints.up('md'));
  const recipeData = useSelector(state => state.recipes.value.find((recipe) => recipe.id === recipeId)) || null;

  if (recipeData === null) {
    return null;
  }

  return (
    <Dialog maxWidth='sm'
            onClose={onClose}
            open={open}>
        <DialogContent>
          <Styled>
            <Image
              src={recipeData.imageUrl}
              width="100%"
              height={matchesSmMediaQuery ? "250px" : "150px"}
              duration={700}
              shift="top"
              distance="20px"
              showLoading
              shiftDuration={400}
              easing={"ease-in"}
              fit="cover"
              bgColor={"inherit"}
            />
            <Typography variant="h5" textAlign="center" marginTop={2} sx={{fontSize: "30px"}}>{recipeData.name}</Typography>
            <Grid
              container
              justifyContent="space-between"
              marginTop={4}
              gap={4}>
              <Grid item>
                <Typography variant="subtitle1">Nr. of servings</Typography>
                <Typography variant="body1">{recipeData.servings}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">Cooking time</Typography>
                <Typography variant="body1">{recipeData.time}</Typography>
              </Grid>
            </Grid>
            <Typography
              variant="h6"
              marginTop={4}
              textAlign="center">
              Ingredients
            </Typography>
            <Grid
              container
              maxWidth={"100%"}
              flexDirection={"column"}
              flexWrap={matchesSmMediaQuery ? "wrap" : "nowrap"}
              maxHeight={matchesSmMediaQuery ? 200 : "initial"}
              marginTop={2}
              gap={1}
              overflow={matchesSmMediaQuery ? "auto" : "initial"}
            >
              {recipeData.ingredients.map((ingredient, index) => (
                <Grid item key={index} flex={matchesSmMediaQuery ? "initial" : "1"}>
                  <Typography
                    variant="body1"
                    className="custom-list-item"
                    paddingLeft={2}
                    marginRight={4}
                  >
                    {ingredient}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Typography
              variant="h6"
              marginTop={4}
              textAlign="center">
              Steps to follow
            </Typography>
            <Typography variant="body1" marginTop={2}>
              {recipeData.steps}
            </Typography>
          </Styled>
        </DialogContent>
      <DialogActions>
        <Button size="small" color="primary" onClick={onEdit}>Edit</Button>
        <Button size="small" color="warning" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewRecipeDialog;
