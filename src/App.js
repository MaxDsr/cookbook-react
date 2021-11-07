import './App.scss';
import { RecipeCard } from './recipe-card/RecipeCard';

function App() {
  const recipeBookData = [
    {
      id: '34651',
      name: 'Name',
      imageUrl: 'https://www.animalzoo.ro/wp-content/uploads/2016/06/iguANA-verde.jpg',
      ingredients: [
      'potato',
      'tomato',
      'bachato with parrots',
      'brocoli',
      'onion'
    ],
      cookTime: '1h 30min',
    },
    {
      id: '345652',
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
    },
    {
      id: '345653',
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
    },
    {
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
    }
  ];

  return (
    <div className="App">
      <div className="container">
        {recipeBookData.map((recipeCardData) =>
          <RecipeCard key={'RecipeCard' + recipeCardData.id} cardData={recipeCardData}/>)}
      </div>
    </div>
  );
}

export default App;
