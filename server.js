const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const User = require('./models/user.js');
const Excercise = require('./models/excercise.js');
var crypto = require("crypto");
const Datelib = require('date-and-time');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

try {
  mongoose.connect("mongodb+srv://chirayu:Chirayu@123@cluster0.jdqrk.mongodb.net/excerciseTracker?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
} catch (err) {
  console.log(err);
}

app.post("/api/users", async function (req, res) {
  var id = crypto.randomBytes(20).toString("hex");
  var username = req.body.username;
  await new User({
    _id: id,
    username: username
  }).save();
  res.json({ _id: id, username: username });
});

app.get("/api/users", async function (req, res) {
  res.status(200).send(await User.find({}).exec());
});

app.post("/api/users/:_id/exercises", async function (req, res) {
  var id = req.params._id;
  var desc = req.body.description;
  var duration = req.body.duration;
  var postdate = req.body.date;
  const user = await User.find({ _id: id }).exec();

  if (!postdate) {
    postdate = new Date();
  } else if (isNaN(Date.parse(postdate))) {
    res.json({ err: "INVALID DATE" })
  }
  postdate = Datelib.format(postdate, 'ddd MMM DD YYYY');




  await new Excercise({
    id: id,
    description: desc,
    duration: duration,
    date: postdate
  }).save();

  res.json({ _id: id, username: user[0].username, date: postdate, duration: duration, description: desc });

});

app.get("/api/users/:_id/logs", async function (req, res) {
  // var from, to, limit = req.query;
  var id = req.params._id;
  const user = await User.find({ _id: id }).exec();
  const excercise = await Excercise.find({ id: id }, 'description duration date').exec();
  const count = (excercise).length;
  // const log = [];
  // log.push(excercise);
  res.json({ _id: id, username: user[0].username, count: count, log: excercise });

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
