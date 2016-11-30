import React, {Component} from 'react';
import {Link} from "react-router";
import io from 'socket.io-client'
let socket = io()

// user inputs the duration of the meeting
export default class User extends Component{
	constructor(prop){
	    super(prop)
	    this.state = {
				individualInput: '',
  	 	}
			this.inputChange = this.inputChange.bind(this)
 	}
	componentDidMount(){

	}
	inputChange(input){
		this.props.individualInputChange(input.target.value, this.props.name)
    this.setState({individualInput:input.target.value},()=>{
    //   socket.emit('individualChange', { name: this.props.name, text: this.state.individualInput });
    })
  }
 	render() {
		const input = {
      width: "75%",
			resize: "none",
			backgroundColor: "#d9d9d9",
      height: "100px",
      display: "flex",
      margin: "auto auto",
      textAlign: "left",
      fontFamimly: "Open Sans",
			fontSize: "15px",
      marginTop: "30px",
      marginBottom: "100px"
    }
  	const user = {
      display: "inline-block",
      width: "300px",
      textAlign: "center",
      margin: "15px",
      padding: "30px",
      paddingTop: "40px",
      paddingBottom: "40px",
    }

    const user_role = {
    	textAlign: "center",
    	marginTop: '30px',
    }
	    return (
	    	<div style={user}>
	    		<div className="user_name_container">
	    			<h3 style={user_role} className="name">{this.props.name}</h3>
	    		</div>
	    		<p style={user_role} className="role">
					My preparation:
						{this.props.answer}
	    		</p>
					<textarea placeholder="Your notes..." style={input} className=" input btn "type = "text" value = {this.state.individualInput} onChange = {this.inputChange}></textarea>

	    	</div>
	    );
	}
}
