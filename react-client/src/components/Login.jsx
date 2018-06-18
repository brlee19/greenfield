import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { FlatButton, RaisedButton, Paper, TextField } from 'material-ui';
import { cyan500, grey300, teal500, teal900, grey700 } from 'material-ui/styles/colors';

import MaterialButton from './MaterialButton.jsx';

const styles = {
	hintStyle: {color: grey700},
	underlineStyle: {borderColor: grey300}
};


class Login extends React.Component{

  constructor(props) {
  	super(props)
  	this.state = { username: '' }
  	this.sendUsernameToServer = this.sendUsernameToServer.bind(this)
		this.handleUsernameState = this.handleUsernameState.bind(this)
		this.goToSignup = this.goToSignup.bind(this)
  }

  sendUsernameToServer(){
  	let userObj = {"username": this.state.username, "password": "pwd"}
		axios.post('/login', {"userObj": userObj})
  	.then((response) => {
			if (response.data.length === 0) {
				this.props.history.push({
					pathname: '/preferences',
					username: this.state.username
				});
			} else {
				this.props.history.push({
					pathname: '/search',
					savedPrefs: response.data,
					username: this.state.username
				});
			}
      
    })
  	.catch((err) => {
			console.log('error logging in', err)
			this.props.history.push('/search')
		})
  }

  handleUsernameState(event){
  	event.preventDefault()
  	this.setState({
  		username: event.target.value
  	}, () => console.log(this.state.username))
	}
	
	goToSignup() {
		this.props.history.push({pathname: '/signup'})
	}

  render() { 
  	return (
			<div style={{backgroundColor: teal500, minHeight: `100vh`, display:"flex", flex: 1, justifyContent: "center", alignItems: "center"}}>

				<Paper style={{
					height: `45rem`,
					width: `22rem`,
					margin: 20,
					paddingTop: `5rem`,
					textAlign: 'center',
					justifyContent: "center", 
					alignItems: "center"
				}} zDepth={4}>
					<img src={require('../assets/logo.svg')} alt="My logo" />
					<h5 >At Home, Anywhere.</h5>
					<br/>
					<h4>Please login to TravelHero.</h4>
					<TextField
						type="text"
						name="username"
						value={this.state.username} 
						onChange={this.handleUsernameState}
						hintText="Username"
						hintStyle={styles.hintStyle}
						inputStyle={{color: `black`}}
						underlineStyle={styles.underlineStyle}
					/>
					<br />
					<TextField
						type="text"
						name="password"
						hintText="Password"
						hintStyle={styles.hintStyle}
						inputStyle={{color: `black`}}
						underlineStyle={styles.underlineStyle}
					/>
					<br/>
					<br/>
					<RaisedButton primary={true} label="LOGIN" onClick={()=> {this.sendUsernameToServer()}}/>
					<br/>
					<br/>
					<FlatButton label="SIGNUP" onClick={this.goToSignup} />
				</Paper>
			</div>
  		)
  	}
}

export default withRouter(Login);