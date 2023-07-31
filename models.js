const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * define the movie schema for the MongoDB
 * @type {mongoose.Schema<Movie>}
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birthday: Date,
  },
  Image: String,
  Featured: Boolean,
});

/**
 * define the user schema for the MongoDB
 * @type {mongoose.Schema<User>}
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
   * hash plain-text password and return the hash
   * @static
   * @param {string} password - user's plain text password
   * @returns {string} - hashed password
   */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
  * validate user password by comparing it with hashed password
  * @param {string} password - user's plain text password
  * @returns {boolean} - true if the passwords match, else false
  */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// associate schemas with their respective MongoDB collections and export them
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
