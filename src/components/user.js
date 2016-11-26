import React, {Component} from 'react';
import {Link} from "react-router";

// user inputs the duration of the meeting
export default class User extends Component{
	constructor(prop){
	    super(prop)
	    this.state = {

  	 	}
 	}

 	render() {

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
    	textAlign: "justify",
    	marginTop: '30px'
    }
	    return (
	    	<div style={user}>
	    		<div className="user_name_container">
	    			<h3 style={user_role} className="name">{this.props.name}</h3>
	    		</div>
	    		<p style={user_role} className="role">
	    			Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
	    		</p>
	    	</div>
	    );
	}
}
