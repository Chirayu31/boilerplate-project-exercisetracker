var mongoose = require('mongoose');

var excerciseSchema = mongoose.Schema({
    id: String,
    desc: String,
    duration: Number,
    date: String
});

var Excercise = mongoose.model('Excercise', excerciseSchema);

module.exports = Excercise;