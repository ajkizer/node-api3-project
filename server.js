const express = require("express");
const userRouter = require("./users/userRouter");
const postRouter = require("./users/userRouter");
const server = express();

server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

module.exports = server;
