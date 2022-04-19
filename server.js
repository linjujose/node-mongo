const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongo cloud connection string
const uri = process.env.ATLAS_URI;
//console.log("URI::", uri);

mongoose.connect(uri, { useNewUrlParser: true });

// open mongo db connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connection established");
});

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentRouter = require("./routes/comment");

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comment", commentRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});