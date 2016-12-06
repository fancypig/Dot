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

var interval = {};
var meetings = {
  '0':{
    minutesLeft: 0,
    secondsLeft: 0,
    meetingTimeLeft: 0,
    status: 'Start'
  }
};

app.use(bodyParser.json());

// require('./config/passport')
app.use(express.static(__dirname + '/public'))
app.use(webpackDevMiddleware(webpack(webpackConfig)))
mongoose.connect(config.mongo.uri)
app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || 'localhost');
app.use('/meeting',require('./server/meeting'));
app.get('*', function(req, res){
  res.sendFile(path.resolve('public/index.html'))
})
// app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/cat' }));
function timeChange(meeting, cb){
  if (meeting.meetingTimeLeft > 0){
    meeting.meetingTimeLeft -= 1
  }
  else{
    console.log('Timeup!')
  }

  cb(meeting)
}

//when passing function as a parameter, bind it otherwise you would be invoking it right there
function test(){
  console.log('test')
}
function tryout(){
  test()
  test()
}
testTmp = test.bind(this)
tryout(test())

io.on('connection', function (socket) {
  socket.on('individualChange', function (data) {
    io.to(data.id).emit('individualChange', {input: data.input, name: data.name})
  });

  socket.on('changeMeetingStatus', function (data) {
    meetings[data.id].status = data.status
    if (data.status == 'Pause'){
      interval[data.id] = setInterval(timeChange.bind(null, meetings[data.id],function(meeting){
        io.to(data.id).emit('timeChange', {meetingInfo: meeting})
      }), 1000)
    }
    else{
      clearInterval(interval[data.id])
    }
    io.to(data.id).emit('changeMeetingStatus', {meetingInfo: meetings[data.id]})
  });

  socket.on('textChange', function (data) {
    io.to(data.id).emit('textChange', {text: data.text})
  });

  socket.on('newMember', function (data) {
    if (meetings[data.memberInfo.id]){
      meetings[data.memberInfo.id]['participants'].push({name: data.memberInfo.name, answer: data.memberInfo.answer})
    }
  });

  socket.on('joinRoom', function (data) {
    socket.join(data.meetingInfo._id)
    if (!meetings[data.meetingInfo._id]){
      meetings[data.meetingInfo._id] = data.meetingInfo
    }
    console.log(meetings[data.meetingInfo._id]['participants'].length)
    io.to(data.meetingInfo._id).emit('joinRoom', {meetingInfo: meetings[data.meetingInfo._id]})
  });
});
server.listen(app.get('port'), function(){
  console.log('server listening on 4000')
});
