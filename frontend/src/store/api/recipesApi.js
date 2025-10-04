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
      // Set default initial data
      transformResponse: (response) => response.data,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to fetch recipes',
      }),
    }),

    // POST /recipes/create - Create a new recipe
    createRecipe: builder.mutation({
      query: (payload) => ({
        url: '/recipes/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Recipe'],
      // Transform response if needed
      transformResponse: (response) => response,
      // Handle errors
      transformErrorResponse: (response) => ({
        status: response.status,
        message: response.data?.message || 'Failed to create recipe',
      }),
    }),

    // PUT /recipes/edit/{recipeId} - Edit an existing recipe
    editRecipe: builder.mutation({
      query: ({ recipeId, ...payload }) => ({
        url: `/recipes/edit/${recipeId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Recipe'],
      // Transform response if needed
      transformResponse: (response) => response,
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
      // Transform response if needed
      transformResponse: (response) => response,
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
