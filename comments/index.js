const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []); //empty array when undefined
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; //returns list of objects of comments related to this id post
  comments.push({
    id: commentId,
    content,
  });

  commentsByPostId[req.params.id] = comments;
  //send back a success created status with posts id object
  res.status(201).send(comments);
});

//posts service is already running on port 4000
app.listen(4001, () => {
  console.log("listening on 4001");
});
