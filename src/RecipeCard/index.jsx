import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import StyledDiv from "./styles";
import Image from "mui-image";

const ingredientsToShow = 4;

function RecipeCard(props) {
  return (
    <StyledDiv>
      <Card>
        <CardActionArea>
          <CardMedia
            component="div"
            alt="cookbook recipe"
          >
            <Image
              src={props.cardData.imageUrl}
              width="100%"
              height="240px"
              duration={700}
              shift="top"
              distance="20px"
              showLoading
              shiftDuration={400}
              easing={"ease-in"}
              fit="cover"
              bgColor={"inherit"}
            />
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" align={'left'}>{props.cardData.name}</Typography>
            <div className="list-header">Ingredients</div>
            <div className="list">
              {props.cardData.ingredients?.slice(0, ingredientsToShow)
                .map(item => <div className="list-item" key={'ingred'+item}>{item}</div>)}
              {ingredientsToShow < props.cardData.ingredients.length ? <li>and more...</li>: ''}
            </div>
            <div className="cook-time">
              <div className="label">Cook Time:</div> {props.cardData.time}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">View more</Button>
          <Button size="small" color="primary" onClick={() => props.onEditClick(props.cardData.id)}>Edit</Button>
          <Button size="small" color="warning" onClick={() => props.onDeleteRecipe(props.cardData.id)}>Delete</Button>
        </CardActions>
      </Card>
    </StyledDiv>
  );
}

export default RecipeCard;
