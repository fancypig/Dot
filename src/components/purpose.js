import React, {Component} from 'react';
import {Link} from "react-router";

// user inputs the duration of the meeting
export default class Purpose extends Component{
	constructor(){
	    super()
	    this.state = {
	      purpose: "Do this and that"
  	 	}
 	}

 	render() {
 		const purpose = {
 			color: "black",
 			margin: "0 auto",
 			position: "absolute",
 			top: "50px",
 			left: "50%",
 			transform: "translateX(-50%)",
 			lineHeight: "50px",
 		}

 			
	    return (
	    	<h1 style={purpose} className="purpose"><strong>Purpose of Meeting:</strong> { this.state.purpose }</h1>
	    );
	}
}
