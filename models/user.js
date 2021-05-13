var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: String,
    username: String
}, { _id: false });

var User = mongoose.model('User', userSchema);

module.exports = User;