// auth.js creates login-endpoint for registered users,
// authenticates login requests using basic HTTP authentication,
// generates a JWT for the user

// setup
const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

// generate JWT Token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// allow registered users to login (POST),
// authenticate (using strategies from passport.js)
module.exports = (router) => {
  router.post("/login", (req, res) => {
    console.log("Login request received:", req.body); 
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        console.log("Error:", error);
        return res.status(400).json({
          message: "Something went wrong" + info,
          user: user,
        });
      }

      if (!user) {
        console.log("No such user:", info);
        return res.status(400).json({
          message: "Incorrect username or password",
          user: user,
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          console.log("Login error:", error);
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
