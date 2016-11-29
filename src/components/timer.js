import React, {Component} from 'react';
import {Link} from "react-router";

// user inputs the duration of the meeting
export default class Timer extends Component{
	constructor(){
	    super()
	    this.state = {
	      meetingTimeLeft: 90,
	      overtime: false
  	 	}

  	 	this.countdown = this.countdown.bind(this)
  	 	this.delay = this.delay.bind(this)
 	}

 	countdown() {
 		this.setState({
 			meetingTimeLeft: this.state.meetingTimeLeft - 1
 		})
 	}

 	delay() {
 		this.setState({
 			meetingTimeLeft: this.state.meetingTimeLeft + 120
 		})
 	}

 	componentDidMount() {
 		this.interval = setInterval(this.countdown, 1000);
 	}

 	render() {
 			var spanPercent = 100-(100*this.state.meetingTimeLeft/90) + '%';
 			var timer_container = {
 				paddingLeft: "20px"
 			}

 			var timer = {
		 		position: "fixed",
		 		top: "0",
		 		left: "5px",
		 		background: "orange",
		 		width: "30px",
		 		height: "100%",
		 		maxHeight: "100%",
		 		transform: "translateY(" + spanPercent + ")"
		 	}

		 	const overtime = {
		 		position: "fixed",
		 		right: "0",
		 		bottom: "0",
		 		transform: "translateX(-110%)",
		 		width: '120px'
		 	}

		 	const time_left = {
		 		position: "fixed",
		 		top: "-20px",
		 		left: "50px"
		 	}

	    return (
	    	<div style={timer_container} className="timer_container">
      		<h5 style={time_left} >Time left for meeting: {this.state.meetingTimeLeft}s</h5>
      		<input style={overtime} className="overtime pointer btn input hvr-grow" type="button" onClick = {this.delay} value = "Next Steps?"/>
      		<div style={timer} className="timer">
	      	</div>
	      </div>
	    );
	}
}
