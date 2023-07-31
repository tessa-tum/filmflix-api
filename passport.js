const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * passport local strategy for authenticating users via username and password
 * @param {Object} credentials - the provided credentials for authentication
 * @param {string} credentials.Username - the username to be authenticated
 * @param {string} credentials.Password - the password to be authenticated
 * @param {function} done - a callback function to be called with a user object if authenticated successfully, or false otherwise
 * @returns {function} the `done()` callback function with the authenticated user object or false
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, done) => {
      try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
          console.log("Incorrect username");
          return done(null, false, {
            message: "Incorrect username",
          });
        }
        if (!user.validatePassword(password)) {
          console.log("Incorrect password");
          return done(null, false, {
            message: "Incorrect password",
          });
        }

        console.log("Finished");
        console.log(user);
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

/**
 * passport JWT strategy for authenticating users via a JSON Web Tokens (JWT)
 * @param {Object} jwtConfig - the configuration options for JWTStrategy
 * @param {function} jwtConfig.jwtFromRequest - a callback function that extracts the token from the authorization header
 * @param {string} jwtConfig.secretOrKey - the secret for verifying the token's signature
 * @param {function} verifyCallback - a callback function for verifying the token payload and returning the corresponding user
 * @returns {Promise} a Promise that resolves to the user object or rejects with an error
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
