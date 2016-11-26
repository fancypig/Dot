var Meeting = require('./meeting.model');
var bodyParser = require('body-parser');
var self = module.exports = {
  finalizeMeeting: function(req,res){
    console.log(req.body)
    var newMeeting = {
      objective: req.body.objective,
      participants: [],
      length: req.body.length,
      preparation: req.body.preparation
    }
    Meeting.create(newMeeting, function(err, meeting){
      if (err|| !meeting){
        console.log(err);
      }
      else{
        res.status(200).json(meeting);
      }
    })

  },
  joinMeeting: function(req,res){
    Meeting.find({'_id':req.params.id}, function(err, meeting){
      if(meeting.length < 1 || meeting == null){
        res.status(404).json('not found')
      }
      else{
        res.status(200).json(meeting)
      }
    })
  },
  joinRoom: function(req,res){
    Meeting.update({'_id':req.params.id}, {$push: {'participants':{'name': req.body.name, 'answer': req.body.answer}}}, function(err, meeting){
      if(meeting.length < 1 || meeting == null){
        res.status(404).json('not found')
      }
      else{
        console.log(meeting)
        res.status(200).json(meeting)
      }
    })
  }

}
