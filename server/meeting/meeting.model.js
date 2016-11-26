'use strict';

var mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
  objective:String,
  participants: [{name: String, answer:String}],
  length: String,
  preparation: String,
});
var Meeting = mongoose.model('meetings', MeetingSchema);
module.exports = Meeting;
