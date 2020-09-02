// Package that offers encryption functionalities (password hashing)
const bcrypt = require("bcrypt");

// Json Web Token package
const jwt = require("jsonwebtoken");

// Require User model
const User = require("../models/user");

// Configuration file that hold environment variables
const config = require("../config/config");

// User signup
exports.userSignup = (req, res, next) => {
  // Create a new user
  const user = new User({
    email: req.body.email,
    // Hashed password will be saved in a database
    password: req.body.password,
  });

  // Save the user
  user
    .save()
    .then((result) => {
      // Status 201 - The request has been fulfilled and has resulted in one or more new resources being created
      res.status(201).json({
        message: "Novi korisnik je dodat",
        result: result,
      });
    })
    .catch((err) => {
      /**
       * Status 422
       * Symfony HTTP Status Constant Response::HTTP_UNPROCESSABLE_ENTITY
       */
      if (err.code == 11000) {
        res
          .status(422)
          .send([
            "Korisnik s unesenom e-mail adresom već postoji u bazi. Molimo provjerite e-mail adresu i pokušajte ponovo.",
          ]);
      } else {
        return next(err);
      }
    });
};

// User login
exports.userLogin = (req, res, next) => {
  const email = req.body.email;
  // Hashed password will be saved in a database
  const password = req.body.password;

  /**
   * Validate whether the credentials are valid, and if it is,
   * I want to create validation JSON Web token (validate the user) and logged in the user
   *
   * First, I want look for a user where the email address in the database matches the email
   * address which I attached to the request (entered in the email field)
   */
  let fetchedUser;

  User.findOne({ email: email })
    .then((user) => {
      // If user does not exist
      if (!user) {
        // Authentication is denied
        return res.status(401).send({
          message:
            "Korisnik s unesenom e-mail adresom ne postoji u bazi. Molimo provjerite i pokušajte ponovo.",
        });
      }
      fetchedUser = user;

      /**
       * If user exist, compare the password that the user entered into the login form
       * with the password stored in the database
       */
      bcrypt.compare(password, user.password).then((result) => {
        /**
         * Get back the result of compare operation
         *
         * The result will be true if we did successfully compare, or false if we failed
         */
        if (!result) {
          return res.status(401).send({
            message:
              "Unijeli ste pogrešnu lozinku. Molimo provjerite i pokušajte ponovo.",
          });
        }

        /**
         * If result is true, then we know what we have a valid password send by the user, then I will
         * create a new Json Web token
         */
        const token = jwt.sign({ userId: fetchedUser._id }, config.jwt.key, {
          expiresIn: "1h",
        });

        // Successfuly authenticated
        res.status(200).json({
          // Return token for user
          token: token,
          expiresIn: 3600, // 3600 miliseconds
          userId: fetchedUser._id,
        });
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Korisnik s unesenom e-mail adresom ne postoji.",
      });
    });
};

// Delete user
exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Korisnik je uspjesno izbrisan",
        });
      } else {
        res.status(500).json({
          message: "U bazi ne postoji korisnik koji odgovara unijetom ID-u",
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        error: err.message,
      });
    });
};
