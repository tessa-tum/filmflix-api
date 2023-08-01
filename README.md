# filmflix API

## Objective

filmflix API is a RESTful API that interacts with a database that stores data about a variety of movies. The application provides users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create as well as edit a list of their favorite movies.

## Build with

### Languages

- HTML
- JavaScript

### Framework, Libraries, Tools

- Node.js 
- Express
- MongoDB (MongoDB Community Server, Mongo Shell, MongoDB Database Tools)
- Endpoint testing with Postman
- Deployed to Heroku

### Dependencies

- `bcrypt` for password hashing
- `body-parser` to read the body of HTTP requests for additional information
- `cors` for domain control access
- `express` as a server-side minimalist programming framework for Node.js
- `express-validator` for server-side validation
- `jsonwebtoken` for token-based authentication
- `mongoose` as ODM (Object Data Modeling) library for MongoDB
- `morgan` as Node.js and Express middleware to log HTTP requests and errors, and simplifies the process.
- `passport`, `passport-jwt`, `passport-local` for authentication / authorization
- `uuid` to generate unique IDs

## Features

- RESTful architecture
- Includes user authentication and authorization
- Based on non-relational database (MongoDB)
- Contains two collections: 'users' and 'movies' with various documents
- Build with "code first" approach: first design endpoints, then design database

## How to run

- For a live test of given API endpoints visit https://filmflix-api.herokuapp.com/.
- You can also clone the repository and test it on your local machine using Postman.

1. Clone repository:
```bash
git clone https://github.com/yourusername/filmflix-api.git
```
2. Navigate to the project's root directory and run npm install to install dependencies.
3. Run MongoDB on your local machine.
4. In the root directory, create a new .env file.
5. Add your MongoDB connection URI at CONNECTION_URI.
6. Run npm start.
7. Go to http://localhost:8080/ in your browser to access API endpoints.

### Endpoints

| URL                              | Method | Business logic                                      |
|----------------------------------|--------|-----------------------------------------------------|
| /                                | GET    | Welcome message                                     |
| /movies                          | GET    | Get a list ofall movies                             |
| /movies/title/:Title             | GET    | Get data about a single movie by title              |
| /movies/genre/:genreName         | GET    | Get data about athe genre of a movie by name        |
| /movies/directors/:directorName  | GET    | Get data about a single director of a movie by name |
| /users                           | POST   | Create a new user                                   |
| /users/:Username                 | PUT    | Update user information by username                 |
| /users/:Username/movies/:MovieID | POST   | Add a movie to a user's list of favorites           |
| /users/:Username/movies/:MovieID | DELETE | Delete a movie from a user's list of favorites      |
| /users/:Username                 | DELETE | Delete a user                                       |
