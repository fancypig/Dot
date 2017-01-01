import React, {Component} from 'react';
import {Link} from "react-router";
import moment from 'moment';
import Timer from './timer';
import Purpose from './purpose';
import User from './user';
import io from 'socket.io-client'

// random jquery stuff here...

let socket = io()
var interval
export default class Room extends Component{
  constructor(){
    super()
    this.state = {
      currentTime: Date.now(),
      meetingInfo:{status:'Start', participants:[{name:'dog',answer: 'delicious'}]},
      input: '',
      end: false,
      meetingStatus: {id:0, length:0, status:'Start'}, //Object
    }
    this.inputChange = this.inputChange.bind(this)
    this.individualInputChange = this.individualInputChange.bind(this)
    this.tick = this.tick.bind(this);
  }
  fetch(){
    var _this = this
    return fetch('/meeting/join/' + this.props.params.param, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purpose: 'room',
      })
    })
    .then((response) => {
      if (response.status != 200){
        console.log('errors')
        return
      }
      else{
        return response.json();
      }
    })
    .then((responseJson)=>{
      var minutes = responseJson[0].length
      var meetingTimeLeft = minutes*60
      var tmp = Object.assign({}, responseJson[0])
      tmp.minutes = minutes
      tmp.meetingTimeLeft = meetingTimeLeft
      tmp.status = 'Start'
      this.setState({meetingInfo: tmp}, ()=> {
        socket.emit('joinRoom', {meetingInfo: this.state.meetingInfo})
        // socket.emit('getInfo', { meetingData: this.state.meetingInfo});
        // this.refs.timer.setState({minutesLeft:minutes, meetingTimeLeft: meetingTimeLeft, meetingLength: minutes*60})

      })
    })
    .catch((error) => {
      console.error(error);
    });
  }
  tick() {
     this.setState({
       currentTime: this.state.dateTimestamp + 1
     });
   }
   componentWillMount(){
   }
   componentDidMount() {
     this.fetch()

     socket.on('joinRoom', (data)=>{
       var minutesLeft = parseInt(data.meetingInfo.meetingTimeLeft/60)
       var secondsLeft = data.meetingInfo.meetingTimeLeft%60
       this.setState({meetingInfo: data.meetingInfo})
       this.refs.timer.setState({minutesLeft:minutesLeft, secondsLeft: secondsLeft, meetingTimeLeft: data.meetingInfo.meetingTimeLeft, meetingLength: data.meetingInfo.minutes*60})
     })

     socket.on('changeMeetingStatus', (data)=>{
      this.setState({meetingInfo: data.meetingInfo})
     })

     socket.on('textChange', (data)=>{
       this.setState({input:data.text})
     })

     socket.on('timeChange', (data)=>{
       var minutesLeft = parseInt(data.meetingInfo.meetingTimeLeft/60)
       var secondsLeft = data.meetingInfo.meetingTimeLeft%60
       if (minutesLeft == 0 && secondsLeft == 0 && !this.state.end){
         
         this.setState({end: true})
         alert('Time Up!')
       }
       this.setState({meetingInfo:data.meetingInfo})
       this.refs.timer.setState({minutesLeft:minutesLeft, secondsLeft: secondsLeft, meetingTimeLeft: data.meetingInfo.meetingTimeLeft, meetingLength: data.meetingInfo.minutes*60})
     })

     socket.on('individualChange', (data)=>{
       name = data.name
       this.refs[name].setState({individualInput: data.input})
     })
     interval = setInterval(this.tick, 1000);
   }

   individualInputChange(input, name){
     socket.emit('individualChange', { id: this.state.meetingInfo._id, name: name, input: input });
    //  socket.emit('textChange', { name: name, text: input , id:this.state.meetingInfo._id});
   }
  inputChange(input){
    this.setState({input:input.target.value},()=>{
      socket.emit('textChange', { text: this.state.input , id:this.state.meetingInfo._id});
    })
  }
  renderUser(){

    return(
      this.state.meetingInfo.participants.map((person, i) => (
        <User individualInputChange = {this.individualInputChange} key = {i} ref = {person.name} name = {person.name} answer = {person.answer}/>
        )
      )
    )
  }
  render(){

    const input = {
      width: "75%",
      height: "250px",
      display: "flex",
      margin: "auto auto",
      textAlign: "left",
      fontFamimly: "Open Sans",
      backgroundColor: '#d9d9d9',
      marginTop: "30px",
      marginBottom: "100px"
    }

    const start = {
      background: "rgb(70, 70, 70)",
      color: "white",
      position: "fixed",
      right: "20px",
      bottom: "20px",
      border: '0px',
      width: '100px',
      height: '40px',
      fontSize: '15px',
    }

    const main_container = {
      paddingTop: "100px",
      background: "rgba(255, 255, 255, 0.9)"
    }

    const users_container = {
      paddingTop: "40px",
      display: "block",
      textAlign: "center"
    }
    const purpose = {
      color: "black",
      margin: "0 auto",
      position: "absolute",
      top: "50px",
      left: "50%",
      transform: "translateX(-50%)",
      lineHeight: "50px",
      fontFamily: "Catamaran"
    }
    // Loop over all existing users
    return(
      <div style={main_container}>
        <h1 style={purpose} className="purpose"><strong>Purpose of Meeting:</strong> { this.state.meetingInfo.objective }</h1>
        <div style={users_container} className="user_container">
          {this.renderUser()}
        </div>
        <Timer ref = "timer"/>
        <textarea placeholder="This is where you take public notes" style={input} className=" input btn "type = "text" value = {this.state.input} onChange = {this.inputChange}></textarea>
        <input ref = "startButton" className = "hvr-grow pointer" type = "button" value = {this.state.meetingInfo.status} style = {start} onClick = {()=>{
          if (this.state.meetingInfo.status == 'Start'){
            // this.refs.timer.interval = setInterval(this.refs.timer.countdown,1000)
            socket.emit('changeMeetingStatus', { id: this.state.meetingInfo._id, status: "Pause" });
          }
          else if (this.state.meetingInfo.status == 'Pause'){
            socket.emit('changeMeetingStatus', { id: this.state.meetingInfo._id, status: "Resume" });
            // clearInterval(this.refs.timer.interval)
          }
          else{
            socket.emit('changeMeetingStatus', { id: this.state.meetingInfo._id, status: "Pause" });
            // this.refs.timer.interval = setInterval(this.refs.timer.countdown,1000)
          }
        }}/>

      </div>
    );
  }
}
