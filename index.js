const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const morgan = require("morgan");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Movies = Models.Movie;
const Users = Models.User;

// let allowedOrigins = [
// "http://localhost:8080",
// "http://localhost:1234",
// "https://git.heroku.com/filmflix-api.git",
//"https://filmflix-api.herokuapp.com",
// "https://filmflix-project.netlify.app",
// "http://localhost:4200",
// ];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors()); // allow all origins (atm)

// restrict origins
// app.use(cors({
// origin: (origin, callback) => {
// if (!origin) return callback(null, true);
// if (allowedOrigins.indexOf(origin) === -1) {
// If a specific origin isn’t found on the list of allowed origins
//let message =
// "The CORS policy for this application does not allow access from origin " +
// origin;
// return callback(new Error(message), false);
//}
//return callback(null, true);
// },
// })
// );

let auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport.js");

// mongoose
// .connect("mongodb://127.0.0.1:27017/myFlixDB", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// })
// .then(() => {
// console.log("Connected to database");
// });

// add MongoDB conncetion
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  });

// log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("common", { stream: accessLogStream }));

/**
 * GET welcome message 
 */
app.get("/", (req, res) => {
  res.send("Welcome to the filmflix API");
});

/**
 * GET a list of all movies
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * GET a single movie by its title
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.get(
  "/movies/title/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ Title: req.params.Title });
      if (!movie) {
        res.status(400).send("No such movie");
      } else {
        res.status(200).json(movie);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * GET a single movie by its ID
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.get(
  "/movies/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ _id: req.params._id })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
/**
 * GET a movie genre by name
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const genre = await Movies.findOne({
        "Genre.Name": req.params.genreName,
      });
      if (!genre) {
        res.status(400).send("No such genre");
      } else {
        res.status(200).json(genre.Genre);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * GET a movie director by name
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const director = await Movies.findOne({
        "Director.Name": req.params.directorName,
      });
      if (!director) {
        res.status(400).send("No such director");
      } else {
        res.status(200).json(director.Director);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * GET all users
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @returns {Object} The response JSON object
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const allUsers = await Users.find();
      if (!allUsers) {
        res.status(400).send("No users");
      } else {
        res.status(200).json(allUsers);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * GET a user by username
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @returns {Object} The response JSON object
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userByName = await Users.findOne({ Username: req.params.Username });
      if (!userByName) {
        res.status(400).send("No such user");
      } else {
        res.status(200).json(userByName);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * POST | allow new users to register
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the response JSON object
 */
app.post(
  "/users",
  [
    check("Username", "Username should be at least 5 characters").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);  // hash passwords

    // search database for requested username and either throw error message or create new user
    try {
      const user = await Users.findOne({ Username: req.body.Username });
      if (user) {
        return res.status(400).json(req.body.Username + " already exists");
      }

      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      });
      res.status(201).json("User has been successfully created. Please log in!");
    } catch (error) {
      console.error(error);
      res.status(500).json("Error: " + error);
    }
  }
);

/**
 * POST | add a movie to a user's list of favorites
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the updated user object JSON
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $addToSet: { FavoriteMovies: req.params.MovieID } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * PUT | allow users to update their info, by username
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the updated user object JSON
 */

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    try {
      // hash passwords
      let hashedPassword = Users.hashPassword(req.body.Password);

      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      );

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * DELETE | allow users to remove a movie from their list of favorites
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {Object} the updated user object JSON
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $pull: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

/**
 * DELETE | allow existing users to deregister
 * use Passport middleware to authenticate user with a JWT
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @returns {string} a success or error message
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await Users.findOneAndRemove({
        Username: req.params.Username,
      });
      if (!deletedUser) {
        res.status(400).send(`User ${req.params.Username} was not found`);
      } else {
        res.status(200).send(`User ${req.params.Username} has been removed`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

// error-handler to log application-level errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
