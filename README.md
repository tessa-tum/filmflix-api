# filmflix API

## Project description

filmflix API is a RESTful API that interacts with a database that stores data about a variety of movies. The application provides users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create as well as edit a list of their favorite movies.

## Getting started

- For a live test of given API endpoints visit https://filmflix-api.herokuapp.com/.
- You can also clone the repository and test it on your local machine using Postman.

1. Clone repository:
```bash
git clone https://github.com/yourusername/myflix-api.git
```
2. Navigate to the project's root directory and run npm install to install dependencies.
3. Run MongoDB on your local machine.
4. In the root directory, create a new .env file.
5. Add your MongoDB connection URI at CONNECTION_URI.
6. Run npm start.
7. Go to http://localhost:8080/ in your browser to access API endpoints.

## Endpoints

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

## Tools used

- Node.js 
- Express
- MongoDB