import './App.scss';
import { RecipeCard } from './recipe-card/RecipeCard';

function App() {
  const recipeBookData = [
    {
      id: '34651',
      name: 'Baker soup',
      imageUrl: 'https://pbs.twimg.com/media/Cs30RK-UkAAvl3V.jpg',
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
      name: 'Bolognese pasta',
      imageUrl: 'https://www.francescakookt.nl/wp-content/uploads/2020/10/mijn-versie-van-spaghetti-bolognese-1.jpg',
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
      name: 'French fries',
      imageUrl: 'https://www.thespruceeats.com/thmb/IHKuXcx3uUI1IWkM_cnnQdFH-zQ=/3485x2323/filters:fill(auto,1)/how-to-make-homemade-french-fries-2215971-hero-01-02f62a016f3e4aa4b41d0c27539885c3.jpg',
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
      name: 'Home burger',
      imageUrl: 'https://live.staticflickr.com/5058/5519067595_6fe442ee19_b.jpg',
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
