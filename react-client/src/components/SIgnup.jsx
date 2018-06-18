import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import MaterialButton from './MaterialButton.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class Signup extends React.Component {
	constructor(props){
		super(props)
	}
  render() { 
    console.log(this.props.history)
  	return (
      <div>
        MVP
      </div>
  		)
  }
}

export default withRouter(Signup);