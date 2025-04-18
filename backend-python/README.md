# Cookbook Recipe API

A Flask-based REST API for managing recipes in a cookbook.

## Prerequisites

- Docker
- Docker Compose

## Setup with Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Initialize the database and seed with sample data:
```bash
docker-compose exec web python init_db.py
```

The API will be available at `http://localhost:3101`

## Development

- The Flask application will automatically reload when you make changes to the Python files
- MySQL data is persisted in a Docker volume
- The database is accessible at `localhost:3102` with credentials:
  - Username: `root`
  - Password: `rootpassword`
  - Database: `cookbook_db`

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/<id>` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/<id>` - Update a recipe
- `DELETE /api/recipes/<id>` - Delete a recipe

## Example Recipe JSON

```json
{
    "title": "Spaghetti Carbonara",
    "description": "Classic Italian pasta dish",
    "ingredients": "Spaghetti, eggs, pancetta, parmesan, black pepper",
    "instructions": "1. Cook pasta...",
    "prep_time": 10,
    "cook_time": 15,
    "servings": 4
}
``` 