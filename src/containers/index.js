import React, {Component} from 'react'
import Home from './home'
import HomePage from '../components/homePage'
import Room from '../components/room'
import Join from '../components/join'
import {Router, Route,IndexRoute, browserHistory} from "react-router"

export default class App extends Component{
  componentDidMount(){

  }
  render(){

    return(
      <Router history = {browserHistory}>
        <Route path = "/" component = {Home}>
          <IndexRoute component = {HomePage}/>
          <Route path= "/meeting_room(/:param)" component = {Room}>
          </Route>
          <Route path= "/join/:param" component = {Join}>
          </Route>
        </Route>
      </Router>
    );
  }
}
