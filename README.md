# Cookbook react app

Use this app to create, view and edit your favourite cookbook recipes.  
Currently this app isn't complete, so you can see there only few hardcoded recipes.

# Run
Clone this repository.  
First use `npm install` from the project directory to install dependencies.

Execute `npm run start` to build and run the project


# About

This project uses Material UI for styled web components.  
Formik for managing forms.  
Redux for managing state.  
lodash for a function. It could be better copying it to my code without importing entire library, but I didn't had time to do that.  

Projects doesn't work with any real BE. All the data management used in this project happens in memory.

App inits with some default recipes.  
For this purpose was created a pseudo BE with a pseudo API service which imitates the real BE calls with some promises.  
  
This app doesn't use any storage service. Images uploaded in the create new recipe form are stored in the memory.  
Please, take in mind that file input doesn't have any validations by type. So don't try to upload big size files. It may result in browser crash.  
In order to record ingredients, please write them in the input separating them by pressing "Enter" key.  
API that fetches recipes may randomly trigger up error. This was made in order to show that app has some error handling and is informing user about it via an alert message. 
