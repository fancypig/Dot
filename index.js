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
});
server.listen(app.get('port'), function(){
  console.log('server listening on 4000')
});
