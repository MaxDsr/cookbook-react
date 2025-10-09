import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../config/api';

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication headers if needed
      // const token = getState().auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }


			// not there yet...
			if (getState().auth.token) {
				headers.set('authorization', `Bearer ${getState().auth.token}`);
			}

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    // GET /recipes - Fetch all recipes
    getRecipes: builder.query({
      query: () => 'recipes',
      providesTags: ['Recipe'],
      // Return response data directly (MongoDB uses _id)
      transformResponse: (response) => response.data || response,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to fetch recipes',
      }),
    }),

    // POST /recipes/create - Create a new recipe
    createRecipe: builder.mutation({
      query: ({ recipeData, imageFile }) => {
        const formData = new FormData();
        
        // Add the image file if it exists
        if (imageFile) {
          formData.append('image', imageFile);
        }
        
        // Add other recipe fields
        formData.append('name', recipeData.name);
        formData.append('servings', recipeData.servings);
        formData.append('time', recipeData.time);
        formData.append('steps', recipeData.steps);
        
        // Add ingredients as JSON string
        formData.append('ingredients', JSON.stringify(recipeData.ingredients));
        
        return {
          url: '/recipes/create',
          method: 'POST',
          body: formData,
          // Don't set Content-Type, let browser set it with boundary
          prepareHeaders: (headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: ['Recipe'],
      // Return response data directly (MongoDB uses _id)
      transformResponse: (response) => response.data || response,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to create recipe',
      }),
    }),

    // PUT /recipes/edit/{recipeId} - Edit an existing recipe
    editRecipe: builder.mutation({
      query: ({ recipeId, recipeData, imageFile }) => {
        // If there's an image file, send as FormData
        if (imageFile) {
          const formData = new FormData();
          
          // Add the image file
          formData.append('image', imageFile);
          
          // Add other recipe fields
          formData.append('name', recipeData.name);
          formData.append('servings', recipeData.servings);
          formData.append('time', recipeData.time);
          formData.append('steps', recipeData.steps);
          
          // Add ingredients as JSON string
          formData.append('ingredients', JSON.stringify(recipeData.ingredients));
          
          return {
            url: `/recipes/edit/${recipeId}`,
            method: 'PUT',
            body: formData,
            // Don't set Content-Type, let browser set it with boundary
            prepareHeaders: (headers) => {
              headers.delete('Content-Type');
              return headers;
            },
          };
        }
        
        // Otherwise, send as JSON (no image update)
        return {
          url: `/recipes/edit/${recipeId}`,
          method: 'PUT',
          body: recipeData,
        };
      },
      invalidatesTags: ['Recipe'],
      // Return response data directly (MongoDB uses _id)
      transformResponse: (response) => response.data || response,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to edit recipe',
      }),
    }),

    // DELETE /recipes/delete/{recipeId} - Delete a recipe
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipes/delete/${recipeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recipe'],
      // Return response data directly (MongoDB uses _id)
      transformResponse: (response) => response.data || response,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to delete recipe',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetRecipesQuery,
  useCreateRecipeMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi;

// Export the API slice reducer
export default recipesApi.reducer;
