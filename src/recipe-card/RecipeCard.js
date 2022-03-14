import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import './RecipeCard.scss';
import { useDispatch } from "react-redux";
import { deleteRecipe } from "../services/store/RecipesSlice";


const ingredientsToShow = 4;

export function RecipeCard(props) {
  const dispatch = useDispatch();

  const onDeleteRecipe = () => {
    dispatch(deleteRecipe(props.cardData.id));
  };

  return (
    <Card className="RecipeCard">
      <CardActionArea>
        <CardMedia
          component="img"
          height="240"
          image={props.cardData.imageUrl}
          alt="cookbook recipe"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align={'left'}>{props.cardData.name}</Typography>
          <div className="list-header">Ingredients</div>
          <ul className="list">
            {props.cardData.ingredients?.slice(0, ingredientsToShow)
              .map(item => <li key={'ingred'+item}>{item}</li>)}
            {ingredientsToShow < props.cardData.ingredients.length ? <li>and more...</li>: ''}
          </ul>
          <div className="cook-time">
            <span className="label">Cook Time:</span> {props.cardData.time}
          </div>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">View more</Button>
        <Button size="small" color="warning" onClick={onDeleteRecipe}>Delete recipe</Button>
      </CardActions>
    </Card>
  );
}
