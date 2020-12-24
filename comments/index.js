const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []); //empty array when undefined
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; //returns list of objects of comments related to this id post
  comments.push({
    id: commentId,
    content,
    status: "pending",
  });

  commentsByPostId[req.params.id] = comments;
  //emit event to event-bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("received event", req.body.type);

  //CommentModerated handled
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { id, postId, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    //emit commentupdated event to event-bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentUpdated",
    data: {
      id: id,
      content,
      postId,
      status
    },
  });
  
  }

  res.send({});
});

//posts service is already running on port 4000
app.listen(4001, () => {
  console.log("listening on 4001");
});
