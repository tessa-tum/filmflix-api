//setup

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// local strategy

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

//JWT strategy

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
