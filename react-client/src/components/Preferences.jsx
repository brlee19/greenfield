import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

class Preferences extends React.Component{
	constructor(props){
		super(props)
		//this.props.location.username is the username
		this.state = {
        bank: '',
        supermarket: '',
        meal_takeaway: '',
        cafe: 'Starbucks',
        gym: '',
        liquor_store: false,
        convenience_store: false,
        laundry: false,
        hair_care: false,
        transit_station: false   
		}
    this.handlePreferenceState = this.handlePreferenceState.bind(this)
    this.sendPreferencesToServer = this.sendPreferencesToServer.bind(this)
	}

	handlePreferenceState(event) {
		const target = event.target;
		console.log('target is', target.type)
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name;
		this.setState({
			[name]: value
		}, () => console.log(this.state))
	}

	sendPreferencesToServer() {
		let userPrefs = {
			preferences: this.state,
			username: this.props.location.username
		}
		axios.post('/preferences', {params: userPrefs})
		.then((response) => {
			console.log('preferences sent!')
			this.props.history.push({
				pathname: '/search',
				prefs: this.state,
				username: this.props.location.username
			});
		})
		.catch((err) => console.log('err saving prefs', err))
	}

	render() {
		let {bank, supermarket, meal_takeaway, cafe, gym, 
			   liquor_store, convenience_store, laundry, hair_care, transit_station} = this.state;
		return (
			<div>
			<AppBar title="TravelHero"/>
			<br></br>
				<div>Preferred Bank</div>
				<TextField name="bank" 
							 type="text" 	 
							 value={bank}
							 onChange={this.handlePreferenceState}/>
				<div>Favorite Supermarket</div>
			  <TextField type="text" 
			         name="supermarket" 
			         value={supermarket}
			         onChange={this.handlePreferenceState}/>
				<div>Favorite Takeout</div>
		    <TextField name="meal_takeaway" 
		    			 type="text" 
		    			 value={meal_takeaway}
		    			 onChange={this.handlePreferenceState}/>
				<div>Favorite Coffeeshop</div>
				<TextField name="cafe"
							 type="text"  
				       value={cafe}
				       onChange={this.handlePreferenceState}/>
			  <div>Gym Membership</div>
				<TextField type="text" 
				       name="gym" 
				       value={gym}
				       onChange={this.handlePreferenceState}/>
			  <div>Liquor Store</div>
				<Checkbox type="checkbox" 
				       name="liquor_store" 
				       value={liquor_store}
				       onCheck={this.handlePreferenceState}/>
			  <div>Convenience Store or Pharmacy</div>
				<Checkbox type="checkbox" 
				       name="convenience_store" 
				       value={convenience_store}
				       onCheck={this.handlePreferenceState}/>
				<div>Laundromat</div>
				<Checkbox type="checkbox" 
				       name="laundry" 
				       value={laundry}
				       onCheck={this.handlePreferenceState}/>
				<div>Haircare</div>
				<Checkbox type="checkbox" 
				       name="hair_care" 
				       value={hair_care}
				       onCheck={this.handlePreferenceState}/>
				<div>Transit Options</div>
				<Checkbox type="checkbox" 
				       name="transit_station" 
				       value={transit_station}
				       onCheck={this.handlePreferenceState}/>

			<RaisedButton onClick={() => {this.sendPreferencesToServer()}}>Submit</RaisedButton>
			</div>
		)
	}
}

export default withRouter(Preferences);