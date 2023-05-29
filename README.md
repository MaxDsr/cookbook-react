# Cookbook react app

Use this app to create, view and edit your favourite cookbook recipes.  
Currently this app isn't complete, so you can see there only few hardcoded recipes.

# Run
Clone this repository.  
First use `npm install` from the project directory to install dependencies.

Execute `npm run start` to build and run the project


# About

This project uses Material UI for styled web components.  
React Hook Form for managing forms.  
Redux for managing state.  
Lodash for a function. It could be better to find a different solution without importing entire library, but I didn't have time to do that.  

Projects doesn't work with any real BE. All the data management used in this project happens in memory.

App inits with some default recipes.  
For this purpose was created a pseudo BE with a pseudo API service which imitates the real BE calls with some promises.  
  
This app doesn't use any storage service. Images uploaded in the create new recipe form are stored in the memory.  
Please, take in mind that file input doesn't have any validations by type. So don't try to upload big size files. It may result in browser crash.  


# Live Demo

https://maxdsr.github.io/cookbook-app/
