import React from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import './RecipeCard.scss';

export class RecipeCard extends React.Component {

  ingredientsToShow = 4;

  recipeCardData = {
    id: '345654',
    name: 'Name',
    imageUrl: 'https://www.animalzoo.ro/wp-content/uploads/2016/06/iguANA-verde.jpg',
    ingredients: [
      'potato',
      'tomato',
      'bachato',
      'brocoli',
      'onion'
    ],
    cookTime: '1h 30min',
  };

  componentDidMount() {
    console.log('props: ', this.props);
  }

  render() {
    return(
      <Card className="RecipeCard">
        <CardActionArea>
          <CardMedia
            component="img"
            height="240"
            image={this.props.cardData.imageUrl}
            alt="cookbook recipe"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" align={'left'}>{this.props.cardData.name}</Typography>
            <div className="list-header">Ingredients</div>
            <ul className="list">
              {this.props.cardData.ingredients?.slice(0, this.ingredientsToShow)
                .map(item => <li key={'ingred'+item}>{item}</li>)}
              {this.ingredientsToShow < this.props.cardData.ingredients.length ? <li>and more...</li>: ''}
            </ul>
            <div className="cook-time">
              <span className="label">Cook Time:</span> {this.props.cardData.cookTime}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">View more</Button>
        </CardActions>
      </Card>
    )
  }
}
