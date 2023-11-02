const {Recipe} = require("../models");

export const recipes = [
  new Recipe({
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
    servings: 2,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  }),
  new Recipe({
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
    servings: 4,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  }),
  new Recipe({
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
    servings: 4,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  }),
  new Recipe({
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
    servings: 2,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  })
];
