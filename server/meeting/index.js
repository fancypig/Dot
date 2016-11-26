var express = require('express');
var controller = require('./meeting.controller');


var router = express.Router();
router.post('/finalize', controller.finalizeMeeting);
router.post('/join/:id', controller.joinMeeting);
router.post('/room/:id', controller.joinRoom)
module.exports = router;
