import { v4 as uuidv4 } from 'uuid';

export const recipes = {
  data: [
    {
      id: uuidv4(),
      name: 'Baker soup',
      imageUrl: 'https://pbs.twimg.com/media/Cs30RK-UkAAvl3V.jpg',
      ingredients: [
        'potato',
        'tomato',
        'bachato with parrots',
        'brocoli',
        'onion'
      ],
      time: '1h 30min',
    },
    {
      id: uuidv4(),
      name: 'Bolognese pasta',
      imageUrl: 'https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/Beef-Bolognese-with-Linguine_EXPS_FT21_130403_F_0423_1.jpg',
      ingredients: [
        'potato',
        'tomato',
        'bachato',
        'brocoli',
        'onion'
      ],
      time: '1h 30min',
    },
    {
      id: uuidv4(),
      name: 'French fries',
      imageUrl: 'https://www.thespruceeats.com/thmb/IHKuXcx3uUI1IWkM_cnnQdFH-zQ=/3485x2323/filters:fill(auto,1)/how-to-make-homemade-french-fries-2215971-hero-01-02f62a016f3e4aa4b41d0c27539885c3.jpg',
      ingredients: [
        'potato',
        'tomato',
        'bachato',
        'brocoli',
        'onion'
      ],
      time: '1h 30min',
    },
    {
      id: uuidv4(),
      name: 'Home burger',
      imageUrl: 'https://live.staticflickr.com/5058/5519067595_6fe442ee19_b.jpg',
      ingredients: [
        'potato',
        'tomato',
        'bachato',
        'brocoli',
        'onion'
      ],
      time: '1h 30min',
    }
  ],
  nextId: uuidv4(),
};
