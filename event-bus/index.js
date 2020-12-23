const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const events = req.body;

  //take the events data and send off to all the running services
  axios.post("http://localhost:4000/events", events);
  axios.post("http://localhost:4001/events", events);
  axios.post("http://localhost:4002/events", events);

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("listening on 4005");
});
