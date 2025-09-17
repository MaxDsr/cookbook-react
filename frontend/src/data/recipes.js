// Mock recipe data for the cookbook app
export const mockRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format",
    servings: 4,
    cookingTime: "01:30", // 1 hour 30 minutes
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella cheese",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Salt",
      "Black pepper"
    ],
    preparationSteps: "1. Preheat your oven to 475°F (245°C).\n2. Roll out the pizza dough on a floured surface to your desired thickness.\n3. Transfer the dough to a pizza stone or baking sheet.\n4. Spread a thin layer of tomato sauce over the dough, leaving a border for the crust.\n5. Tear the mozzarella into small pieces and distribute evenly over the sauce.\n6. Drizzle with olive oil and season with salt and pepper.\n7. Bake for 12-15 minutes until the crust is golden and the cheese is bubbly.\n8. Remove from oven and immediately top with fresh basil leaves.\n9. Let cool for 2-3 minutes before slicing and serving."
  },
  {
    id: 2,
    title: "Chicken Alfredo Pasta",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop&auto=format",
    servings: 6,
    cookingTime: "00:45",
    ingredients: [
      "Fettuccine pasta",
      "Chicken breast",
      "Heavy cream",
      "Parmesan cheese",
      "Garlic cloves",
      "Butter",
      "Salt",
      "Black pepper",
      "Italian seasoning"
    ],
    preparationSteps: "1. Cook fettuccine according to package directions until al dente.\n2. Season chicken breast with salt, pepper, and Italian seasoning.\n3. In a large skillet, cook chicken over medium-high heat until golden brown and cooked through, about 6-7 minutes per side.\n4. Remove chicken and let rest, then slice into strips.\n5. In the same skillet, melt butter and sauté minced garlic for 1 minute.\n6. Pour in heavy cream and bring to a simmer.\n7. Gradually whisk in grated Parmesan cheese until smooth.\n8. Add cooked pasta and chicken back to the skillet.\n9. Toss everything together and serve immediately with extra Parmesan."
  },
  {
    id: 3,
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&auto=format",
    servings: 24,
    cookingTime: "00:25",
    ingredients: [
      "All-purpose flour",
      "Butter",
      "Brown sugar",
      "White sugar",
      "Eggs",
      "Vanilla extract",
      "Baking soda",
      "Salt",
      "Chocolate chips"
    ],
    preparationSteps: "1. Preheat oven to 375°F (190°C).\n2. In a large bowl, cream together butter, brown sugar, and white sugar until light and fluffy.\n3. Beat in eggs one at a time, then add vanilla extract.\n4. In a separate bowl, whisk together flour, baking soda, and salt.\n5. Gradually mix the dry ingredients into the wet ingredients.\n6. Fold in chocolate chips.\n7. Drop rounded tablespoons of dough onto ungreased baking sheets.\n8. Bake for 9-11 minutes until golden brown around the edges.\n9. Cool on baking sheet for 5 minutes before transferring to a wire rack."
  },
  {
    id: 4,
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&auto=format",
    servings: 4,
    cookingTime: "00:15",
    ingredients: [
      "Romaine lettuce",
      "Caesar dressing",
      "Parmesan cheese",
      "Croutons",
      "Anchovy fillets",
      "Lemon juice",
      "Garlic",
      "Worcestershire sauce"
    ],
    preparationSteps: "1. Wash and chop romaine lettuce into bite-sized pieces.\n2. In a large salad bowl, whisk together Caesar dressing, lemon juice, minced garlic, and Worcestershire sauce.\n3. Add chopped anchovy fillets if desired.\n4. Add lettuce to the bowl and toss well to coat with dressing.\n5. Sprinkle generously with grated Parmesan cheese.\n6. Top with croutons.\n7. Serve immediately while lettuce is crisp."
  },
  {
    id: 5,
    title: "Beef Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&auto=format",
    servings: 4,
    cookingTime: "00:30",
    ingredients: [
      "Beef sirloin",
      "Bell peppers",
      "Broccoli",
      "Carrots",
      "Soy sauce",
      "Garlic",
      "Ginger",
      "Sesame oil",
      "Cornstarch",
      "Vegetable oil"
    ],
    preparationSteps: "1. Slice beef into thin strips and marinate with soy sauce and cornstarch for 15 minutes.\n2. Cut all vegetables into uniform bite-sized pieces.\n3. Heat vegetable oil in a large wok or skillet over high heat.\n4. Add beef and stir-fry for 2-3 minutes until browned.\n5. Remove beef and set aside.\n6. Add more oil if needed, then stir-fry vegetables starting with harder ones like carrots and broccoli.\n7. Add garlic and ginger, stir-fry for 30 seconds.\n8. Return beef to the wok, add remaining soy sauce and sesame oil.\n9. Stir-fry everything together for 1-2 minutes until heated through.\n10. Serve immediately over steamed rice."
  }
];

// Helper function to get recipe by ID
export const getRecipeById = (id) => {
  return mockRecipes.find(recipe => recipe.id === id);
};

// Helper function to format cooking time for display
export const formatCookingTime = (timeString) => {
  return timeString; // Already in HH:MM format
};

// Helper function to parse cooking time for editing
export const parseCookingTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
};

// Helper function to create cooking time string
export const createCookingTime = (hours, minutes) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
