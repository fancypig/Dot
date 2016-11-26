import React, {Component} from 'react';
import {Link} from "react-router";
import styles from '../style.css';
import Modal from 'react-modal'
import uri from '../../config/auth'

let index = 0
let questions = ['What is the objective of this meeting?', 'How long is the meeting?', 'What are your questions to participants?']
export default class HomePage extends Component{
  constructor(){
    super();
    this.state = {
      objective: '',
      organizer: '',
      showJoin: false,
      length:'',
      preparation: '',
      show: false,
      showResult: false,
      currentTitle: questions[0],
      meetingCode: '',
      meetingInfo:{},
    }
    this.inputChange = this.inputChange.bind(this)
    this.createMeeting = this.createMeeting.bind(this)
    this.joinMeeting = this.joinMeeting.bind(this)
  }

  joinMeeting(){
    return(
      <Modal
       isOpen={this.state.show}
       onRequestClose={()=> this.setState({showJoin:false})}
       style = {modal_style}>
       <div className="modal_ask_container">
         <h2>Enter your meeting Code</h2>
          <div className="modal_buttons_container">
          <input placeholder="Write here" className="full_width input" type = "text" value = {this.state.meetingCode} onChange = {(data)=>this.setState({meetingCode:data.target.value}, ()=>console.log(this.state.meetingCode))}/>
         </div>
       </div>
       <input className="cancel_button hvr-grow pointer" type="button" onClick = {()=> this.setState({show:false})} value = "Join"/>
     </Modal>
    )
  }
  componentDidMount(){

  }
  createMeeting(){
    var _this = this
    return fetch('/meeting/finalize', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purpose: 'finalize',
        objective: this.state.objective,
        length: this.state.length,
        preparation: this.state.preparation,

      })
    })
    .then((response) => {
      if (response.status != 200){
        console.log('errors')
        return
      }
      else{
        this.setState({show:false}, ()=> this.setState({showResult: true}))
        return response.json();
      }
    })
    .then((responseJson)=>{
      this.setState({meetingInfo: responseJson})
    })
    .catch((error) => {
      console.error(error);
    });
  }
  // directToPage(){
  //   console.log('dog')
  //   var _this = this
  //   return fetch('meeting/join/' + this.state.meetingInfo._id, {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       purpose: 'join',
  //     })
  //   })
  //   .then((response) => {
  //     if (response.status != 200){
  //       console.log('errors')
  //       return
  //     }
  //     else{
  //       return response.json();
  //     }
  //   })
  //   .then((responseJson)=>{
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // }
  inputChange(data){
    if (index == 0)
      this.setState({objective: data.target.value})
    else if (index == 1)
      this.setState({length: data.target.value})
    else if (index == 2)
      this.setState({preparation: data.target.value})
  }
  renderModalResult(){

    return(
      <Modal
       isOpen={this.state.showResult}
       onRequestClose={()=> this.setState({showResult:false})}
       style = {modal_style}>
       <div className="modal_join_success">
         <h4> Congrats, you have succesfully created a meeting!</h4>
         <h3> Your meeting access ID is : <strong>{this.state.meetingInfo._id}</strong></h3>
         <p> Share the meeting page with your teammates by entering their emails </p>
         <Link to = {'join/' + this.state.meetingInfo._id} style = {join_meeting} className="hvr-grow" type="button" > Join the meeting </Link>
         <input className="btn pointer hvr-grow" type="button" onClick = {()=> this.setState({show:false})} value = "Share"/>
         <input className="btn pointer hvr-grow" type="button" onClick = {()=> this.setState({show:false})} value = "Cancel"/>
       </div>
     </Modal>
    )
  }
  renderModal(){
    var backButton
    var nextButton
    var inputField
    if (index > 0){
      backButton = <input className="btn input pointer hvr-grow" type="button" onClick = {()=>{
        index -= 1
        this.setState({currentTitle: questions[index]})
      }} value = "Back"/>
    }
    if (index < 2){
      nextButton = <input className="next_button btn hvr-grow pointer" type="button"  value = "Next" onClick = {()=> {
          index+=1
          this.setState({currentTitle: questions[index]})
        }}/>
    }

    if (index == 0){
      inputField = <input placeholder="Write here" className="full_width input" type = "text" value = {this.state.objective} onChange = {this.inputChange}/>
    }
    else if (index == 1){
      inputField = <input placeholder="Write here" className="full_width input" type = "text" value = {this.state.length} onChange = {this.inputChange}/>
    }
    else{
      nextButton = <input className="next_button btn hvr-grow pointer" type="button"  value = "Submit" onClick = {this.createMeeting}/>
      inputField = <input placeholder="Write here" className="full_width input" type = "text" value = {this.state.preparation} onChange = {this.inputChange}/>
    }

    return(
      <Modal
       isOpen={this.state.show}
       onRequestClose={()=> this.setState({show:false})}
       style = {modal_style}>
       <div className="modal_ask_container">
         <h2>{this.state.currentTitle}</h2>
           {inputField}
          <div className="modal_buttons_container">
           {backButton}
           {nextButton}
         </div>
       </div>
       <input className="cancel_button hvr-grow pointer" type="button" onClick = {()=> this.setState({show:false})} value = "Cancel"/>
     </Modal>
    )
  }
  render(){


    var self = this;
    return(
      <div style={main_content} className="main_content">
        <div style={front_page} className="front_page">
          <h1 style={tagline} className="type-animation enable-cursor">Perfect Meetings@ Everytime.</h1>
          <div style={button_container} className="button_container">
            {this.renderModal()}
            {this.renderModalResult()}
            <input style={create_meeting} className="create_meeting hvr-grow pointer" type="button" onClick = {()=> {this.setState({show:true})}} value = "Create Meeting"/>
          </div>
        </div>
      </div>
    );
  }
}
const modal_style = {
  content:{
    height: '80%',
    width: '80%',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    background: "rgb(40, 100, 180)",
    color: "white"
  }
}
const main_content = {
  margin: '0',
  fontFamily: "Open Sans"
}

const front_page = {
  background: 'rgba(255, 255, 255, 0.65)',
  height: "100vh",
  position: "absolute",
  textAlign: "center",
  width: "100%",
  top: "0",
  left: "0"
};

const tagline = {
  marginTop: "160px",
  marginBottom: "50px",
  fontFamily: "Catamaran",
  fontWeight: "900",
  fontSize: "3em",
  color: "rgb(11, 8, 43)"
}

const button_container = {

}

const create_meeting = {
  border: "none",
  background: "rgb(40, 100, 180)",
  padding: "20px",
  margin: "15px",
  fontSize: "18px",
  boxSizing: "content-box",
  width: "150px",
  color: "white",
  lineHeight: "20px",
  paddingLeft: "30px",
  paddingRight: "30px"
}

const join_meeting = {
  border: "none",
  background: "rgb(223, 244, 63)",
  padding: "20px",
  margin: "15px",
  fontSize: "18px",
  textDecoration: "none",
  boxSizing: "content-box",
  width: "150px",
  display: "inline-block",
  color: "black",
  lineHeight: "20px",
  paddingLeft: "30px",
  paddingRight: "30px"
}
