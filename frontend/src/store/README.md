# RTK Query Store Setup

This directory contains the Redux store configuration using RTK Query for centralized API state management.

## Structure

```
src/store/
├── store.js           # Main store configuration
├── api/
│   └── recipesApi.js  # Recipes API slice
└── README.md          # This file
```

## Usage

### In Components

```javascript
import { 
  useGetRecipesQuery, 
  useCreateRecipeMutation, 
  useEditRecipeMutation, 
  useDeleteRecipeMutation 
} from '../store/api/recipesApi';
import { useApiState, useMutationState } from '../hooks/useApiState';

function RecipesComponent() {
  // Query for fetching data
  const recipesQuery = useGetRecipesQuery();
  const recipesState = useApiState(recipesQuery);

  // Mutations for modifying data
  const [createRecipe] = useCreateRecipeMutation();
  const [editRecipe] = useEditRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  // Handle different states
  if (recipesState.isLoading) return <div>Loading...</div>;
  if (recipesState.isError) return <div>Error: {recipesState.error}</div>;
  if (recipesState.isSuccess) return <div>Data: {recipesState.data}</div>;

  // Handle mutations
  const handleCreate = async (data) => {
    try {
      await createRecipe(data).unwrap();
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await editRecipe({ recipeId: id, ...data }).unwrap();
    } catch (error) {
      console.error('Failed to edit:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id).unwrap();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };
}
```

## API States

The `useApiState` hook provides standardized state management:

- **idle**: No data interaction
- **loading**: Request in progress
- **success**: Request completed successfully
- **error**: Request failed

## Configuration

Update the API base URL in `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  // ... other config
};
```

## Environment Variables

Create a `.env` file in the frontend root:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Authentication

To add authentication headers, uncomment and modify the `prepareHeaders` function in `recipesApi.js`:

```javascript
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
},
```
