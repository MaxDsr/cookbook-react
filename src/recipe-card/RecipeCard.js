import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { CookTime, Label, ListHeader, RecipeCardWrap, List, ListItem } from "./RecipeCardStyles";

const ingredientsToShow = 4;

export function RecipeCard(props) {
  return (
    <RecipeCardWrap>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="240"
            image={props.cardData.imageUrl}
            alt="cookbook recipe"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" align={'left'}>{props.cardData.name}</Typography>
            <ListHeader>Ingredients</ListHeader>
            <List>
              {props.cardData.ingredients?.slice(0, ingredientsToShow)
                .map(item => <ListItem key={'ingred'+item}>{item}</ListItem>)}
              {ingredientsToShow < props.cardData.ingredients.length ? <li>and more...</li>: ''}
            </List>
            <CookTime>
              <Label>Cook Time:</Label> {props.cardData.time}
            </CookTime>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">View more</Button>
          <Button size="small" color="warning" onClick={() => props.onDeleteRecipe(props.cardData.id)}>
            Delete recipe
          </Button>
        </CardActions>
      </Card>
    </RecipeCardWrap>
  );
}
