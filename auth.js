const jwtSecret = "your_jwt_secret";
const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

/**
 * generate a JWT token that is signed with the JWT secret (expires in 7 days)
 * @param {User} user - the user object that will be encoded in the JWT
 * @returns {string} the JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/**
* add a route handler for the “/login” endpoint to the router,
* use passport to authenticate the user with the local strategy,
* and generate a JWT token if successful
@param {Object} router - the router object to attach the route handler to
*/
module.exports = (router) => {
  router.post("/login", (req, res) => {
    // console.log("Login request received:", req.body);
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
