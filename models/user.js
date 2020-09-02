const mongoose = require("mongoose");

// Package that offers encryption functionalities (password hashing)
const bcrypt = require("bcrypt");

// Models are defined through the Schema interface.
const Schema = mongoose.Schema;

// Custom email regex validation
const validateEmail = (email) => {
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Defining User schema
 *
 * Mongoose schema is configurator object for a Mongoose model.
 * A SchemaType is then a configuration object for an individual property
 *
 * Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
 */
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: "Unesite ispravnu e-mail adresu",
    validate: [validateEmail, "Unesite ispravnu e-mail adresu"],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Unesite ispravnu e-mail adresu",
    ],
  },
  password: {
    type: String,
    required: "Lozinka je obavezna",
    minlength: [4, "Lozinka mora da sadrži minimalno 4 karaktera"],
  },
});

userSchema.pre("save", function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    // Catch an error
    if (err) return next(err);
    // Hash password
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

// Compiling Schema into a model
module.exports = mongoose.model("User", userSchema);
