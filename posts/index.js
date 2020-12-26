const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  //emit event to event-bus
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  //send back a success created status with posts id object
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("received event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("v55");
  console.log("listening on 4000");
});
