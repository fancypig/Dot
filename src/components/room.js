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
      meetingInfo:{participants:[{name:'dog',answer: 'delicious'}]},
      input: '',
      buttonText: 'Start',
    }
    this.inputChange = this.inputChange.bind(this)
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
      this.setState({meetingInfo: responseJson[0]}, ()=> {
        var minutes = this.state.meetingInfo.length

        this.refs.timer.setState({minutesLeft:minutes, meetingTimeLeft: minutes*60, meetingLength: minutes*60})

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
     socket.emit('joinRoom', { text: "refresh please" });
   }
   componentDidMount() {
     this.fetch()
     socket.on('changeMettingStatus', (data)=>{
       this.setState({buttonText:data.status})
     })
     socket.on('textChange', (data)=>{
       this.setState({input:data.text.text})
     })
     socket.on('joinRoom', (data)=>{
       this.fetch()
     })
     socket.on('individualChange', (data)=>{
       console.log(data)
       name = data.name
       this.refs[name].setState({individualInput: data.text})
     })
     interval = setInterval(this.tick, 1000);
   }

  inputChange(input){
    this.setState({input:input.target.value},()=>{
      socket.emit('textChange', { text: this.state.input });
    })
  }
  renderUser(){

    return(
      this.state.meetingInfo.participants.map((person, i) => (
        <User key = {i} ref = {person.name} name = {person.name} answer = {person.answer}/>
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
      top: "20px",
      border: '0px',
      width: '100px',
      height: '40px',
      fontSize: '15px',
    }

    const exit = {
      background: "rgb(70, 70, 70)",
      color: "white",
      position: "fixed",
      right: "0",
      bottom: "0"
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
        <input ref = "startButton" className = "hvr-grow pointer" type = "button" value = {this.state.buttonText} style = {start} onClick = {()=>{
          if (this.state.buttonText == 'Start'){
            this.refs.timer.interval = setInterval(this.refs.timer.countdown,1000)
            socket.emit('changeMettingStatus', { status: "Pause" });
          }
          else if (this.state.buttonText == 'Pause'){
            socket.emit('changeMettingStatus', { status: "Resume" });
            clearInterval(this.refs.timer.interval)
          }
          else{
            socket.emit('changeMettingStatus', { status: "Pause" });
            this.refs.timer.interval = setInterval(this.refs.timer.countdown,1000)
          }
        }}/>
        <Link style={exit} className="clear input btn" onClick = {()=> {
          clearInterval(interval)
          clearInterval(this.refs.timer.interval)}
        } to = "">Exit</Link>
      </div>
    );
  }
}
