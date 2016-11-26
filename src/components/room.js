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
      input: '',
    }
    this.inputChange = this.inputChange.bind(this)
    this.tick = this.tick.bind(this);
  }
  tick() {
     this.setState({
       currentTime: this.state.dateTimestamp + 1
     });
   }
   componentDidMount() {
     socket.on('textChange', (data)=>{
       this.setState({input:data.text.text})
     })
     interval = setInterval(this.tick, 1000);
   }

  inputChange(input){
    this.setState({input:input.target.value},()=>{
      socket.emit('textChange', { text: this.state.input });
    })
  }
  render(){

    const input = {
      width: "75%",
      height: "250px",
      display: "flex",
      margin: "auto auto",
      textAlign: "left",
      fontFamimly: "Open Sans",
      marginTop: "30px",
      marginBottom: "100px"
    }

    const exit = {
      background: "rgb(70, 70, 70)",
      color: "white",
      position: "fixed",
      right: "0",
      bottom: "0"
    }

    const main_container = {
      marginTop: "100px"
    }

    const users_container = {
      paddingTop: "40px",
      display: "block",
      textAlign: "center"
    }


// Loop over all existing users
    return(
      <div style={main_container}> 
        <Purpose ref = "purpose"/>
        <div style={users_container} className="user_container"> 
          <User name="Tom" ref = "user"/>
          <User name="Tim" ref = "user"/>
          <User name="Superman" ref = "user"/>
          <User name="Timmy" ref = "user"/>
          <User name="Tammy" ref = "user"/>
          <User name="Sophia" ref = "user"/>
        </div>
        <Timer ref = "timer"/>
        <textarea placeholder="This is where you take notes..." style={input} className=" input btn "type = "text" value = {this.state.input} onChange = {this.inputChange}></textarea>
        <Link style={exit} className="clear input btn" onClick = {()=> {
          clearInterval(interval)
          clearInterval(this.refs.timer.interval)}
        } to = "">Exit</Link>
        <div className="pointer prev_person"></div>
        <div className="pointer next_person"></div>
      </div>
    );
  }
}