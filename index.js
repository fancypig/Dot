const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

var passport = require('passport')
var path = require('path');
var express = require('express')
var app = express();
var mongoose = require('mongoose')
var config = require('./config/mongoDB')
var server = require('http').Server(app)
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var meetings = [{
  id: 0,
  timeLeft: 0,
  status: 'Start'
}]

app.use(bodyParser.json());

// require('./config/passport')
app.use(express.static(__dirname + '/public'))
app.use(webpackDevMiddleware(webpack(webpackConfig)))
mongoose.connect(config.mongo.uri)
app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || 'localhost');
app.use('/meeting',require('./server/meeting'));
// app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/cat' }));
io.on('connection', function (socket) {
  socket.on('textChange', function (data) {
    io.emit('textChange', {text: data})
  });
  socket.on('getInfo', function (data) {
    var exist = false
    var infoGet = {}
    for (var i = 0; i< meetings.length; i++){
      if (meetings[i].id == data.meetingData._id)
        exist = true
        infoGet = meetings[i]
    }
    if (!exist){
      infoGet = {
        id: data.meetingData._id,
        meetingTimeLeft: data.meetingData.length,
        status: 'Start',
      }
      meetings.push(infoGet)
    }
    io.emit('getInfo',{infoGet: infoGet})
  });
  socket.on('individualChange', function (data) {
    io.emit('individualChange', {text: data.text, name: data.name})
  });
  socket.on('changeMeetingStatus', function (data) {
    returnValue = {}
    for (var i = 0; i< meetings.length; i++){
      if (meetings[i].id == data.id){
        meetings[i].status = data.status
        returnValue = meetings[i]
      }
    }
    io.emit('changeMeetingStatus', {meetingStatus: returnValue})
  });
  socket.on('detectTime', function (data) {
    io.emit('individualChange', {time: data.time})
  });
  socket.on('joinRoom', function (data) {
    io.emit('joinRoom', {refresh: data})
  });
});
server.listen(app.get('port'), function(){
  console.log('server listening on 4000')
});
