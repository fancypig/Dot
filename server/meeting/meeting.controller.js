var Meeting = require('./meeting.model');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var options = {
    service: 'gmail',
    auth: {
        user: 'percytsy@gmail.com',
        pass: process.env.GMAILPASS
    }
  };
var transporter = nodemailer.createTransport(smtpTransport(options));
var self = module.exports = {
  finalizeMeeting: function(req,res){
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
  sendEmail: function(req, res){
    var content = ''
    var mailOptions={
      from: 'percytsy@gmail.com',
        to : 'percytsy@gmail.com',
        subject : 'Meeting result',
        text : JSON.stringify(req.body.meetingInfo)
    }
    transporter.sendMail(mailOptions, function(error, response){
     if(error){
          console.log('error ' + error);
        res.status(400).json("error");
     }
     else{
          res.status(200);
    }
    })
  },
  joinMeeting: function(req,res){
    console.log(req.params)
    Meeting.find({'_id':req.params.id}, function(err, meeting){
      if(!meeting || meeting.length < 1 || meeting == null){
        res.status(404).json('not found')
      }
      else{
        res.status(200).json(meeting)
      }
    })
  },
  joinRoom: function(req,res){
    Meeting.update({'_id':req.params.id}, {$push: {'participants':{'name': req.body.name, 'answer': req.body.answer}}}, function(err, meeting){
      if(!meeting || meeting.length < 1 || meeting == null){
        res.status(404).json('not found')
      }
      else{
        res.status(200).json(meeting)
      }
    })
  }

}
