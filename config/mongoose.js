// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");

// Configuration file that hold environment variables
const config = require("./config");

// Connecting to MongoDB
mongoose
  .connect(
    "mongodb://localhost:27017/authentication",
    /**
     * The underlying MongoDB driver has deprecated their current connection string parser.
     * Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser
     */
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  // Connection to database is successfully
  .then(() => {
    console.log("Successfully connected to database");
  })
  // Catch and log any potential error we might have
  .catch((err) => {
    console.log("Connection to database failed", err);
  });

/**
 * By default, Mongoose 5.x calls the MongoDB driver's ensureIndex() function.
 * The MongoDB driver deprecated this function in favor of createIndex().
 * Set the useCreateIndex global option to opt in to making Mongoose use createIndex() instead.
 */
mongoose.set("useCreateIndex", true);
