const express = require("express");

// User controller
const UserController = require("../controllers/user");

// Express router
const router = express.Router();

// Signup route
router.post("/signup", UserController.userSignup);

// Login route
router.post("/login", UserController.userLogin);

// Delete one user
router.delete("/delete/:userId", UserController.deleteUser);

// Exports the user model
module.exports = router;
