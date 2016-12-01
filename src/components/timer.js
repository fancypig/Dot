import React, {Component} from 'react';
import {Link} from "react-router";

// user inputs the duration of the meeting
export default class Timer extends Component{
	constructor(){
	    super()
	    this.state = {
	      meetingTimeLeft: 90,
				minutesLeft: 5,
				secondsLeft: 0,
	      overtime: false,
				meetingLength: 90,
  	 	}

			//  	this.countdown = this.countdown.bind(this)
			//  	this.delay = this.delay.bind(this)
 	}

 // 	countdown() {
	// 	if (this.state.meetingTimeLeft > 0){
	// 		this.setState({meetingTimeLeft: this.state.meetingTimeLeft-1})
	// 	}
	// 	if (this.state.secondsLeft > 0){
	// 		this.setState({
	// 			secondsLeft: this.state.secondsLeft - 1
	// 		})
	// 	}
	// 	else{
	// 		if (this.state.minutesLeft > 0){
	// 			this.setState({
	// 				minutesLeft: this.state.minutesLeft - 1,
	// 				secondsLeft: 59
	// 			})
	// 		}
	// 		else{
	// 			alert('Time Up!')
	// 			clearInterval(this.interval)
	// 			this.setState({
	// 				overtime: true
	// 			})
	// 		}
	// 	}
 // 	}
	//
 // 	delay() {
 // 		this.setState({
 // 			meetingTimeLeft: this.state.meetingTimeLeft + 120
 // 		})
 // 	}

 	componentDidMount() {
 		this.interval;
 	}

 	render() {
 			var spanPercent = this.state.meetingTimeLeft/this.state.meetingLength*100 + '%';
 			var timer_container = {
 				paddingLeft: "20px"
 			}

 			var timer = {
		 		position: "fixed",
		 		top: "0",
		 		left: "5px",
		 		background: "orange",
		 		width: "30px",
		 		height: spanPercent,
		 		maxHeight: "100%",
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
      		<h5 style={time_left} >Time remaining for meeting: {this.state.minutesLeft}:{this.state.secondsLeft}</h5>
      		<div style={timer} className="timer">
	      	</div>
	      </div>
	    );
	}
}
