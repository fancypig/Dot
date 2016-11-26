import React, {Component} from 'react';
import {Link} from "react-router";
import moment from 'moment';
import Modal from 'react-modal'
export default class Join extends Component{
  constructor(){
    super()
    this.state = {
      currentTime: Date.now(),
      meetingInfo: {
        preparation: 'what do you want?',
        objective: 'make money',
        length: '120',
      },
      show: true,
      showPrep: false,
      answer: String,
      name: '',
      }
  }
  directToPage(){
    var _this = this
    return fetch('/meeting/join/' + this.props.params.param, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purpose: 'join',
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
      console.log(responseJson[0])
      this.setState({meetingInfo: responseJson[0]})
    })
    .catch((error) => {
      console.error(error);
    });
  }
   componentWillMount() {
     this.directToPage()
   }
   joinRoom(){
     var _this = this
     return fetch('/meeting/room/' + this.props.params.param, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         purpose: 'room',
         name: this.state.name,
         answer: this.state.answer,
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
       console.log(responseJson)
     })
     .catch((error) => {
       console.error(error);
     });
   }
   renderModal(){
     return(
       <Modal
        isOpen={this.state.show}
        style = {modal_style}>
        <h2>What is your name</h2>
        <input type="text" defaultValue = '' onChange = {(text)=>this.setState({name: text.target.value})}/>
        <input type = "button" value = "Next" onClick = {()=>{
          this.setState({show: false}, ()=>{this.setState({showPrep: true})})
        }}/>
      </Modal>
     )
   }
   renderPrepModal(){
     return(
       <Modal
        isOpen={this.state.showPrep}
        style = {modal_style}>
        <h2>{this.state.meetingInfo.preparation}</h2>
        <input type="text" defaultValue = ''  onChange = {(text)=>{
          this.setState({answer: text.target.value})}}/>
        <input type = "button" value = "Enter" onClick = {()=>{
           this.joinRoom()
         }}/>
      </Modal>
     )
   }
  render(){
    return(
      <div>
        {this.renderModal()}
        {this.renderPrepModal()}
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgb(40, 100, 180)",
    color: "white"
  }
}
