import React from 'react';
import axios from 'axios';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import {cyan500, grey300, teal500, teal900} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import Paper from 'material-ui/Paper';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SearchIcon from 'material-ui/svg-icons/action/search';


// import MaterialButton from './MaterialButton';

class IconLogoInline extends React.Component{
	render() {
		return (
			<svg version="1.1" width="11rem" height="4.5rem" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
				<g fill="none" fill-rule="evenodd">
					<g fill="#00443E">
						<g transform="translate(128)" fill-rule="nonzero">
							<path d="m19.579 33c-0.31933 0-0.57922-0.36616-0.57922-0.81803s0.25948-0.81803 0.57922-0.81803c2.0469 0 3.7392-0.35083 3.7561-0.3548 0.31612-0.066987 0.61095 0.24183 0.65835 0.68803 0.046996 0.44734-0.17111 0.86402-0.48723 0.931-0.073105 0.014192-1.7951 0.37183-3.9272 0.37183z" />
							<path d="m39.745 9.9984c-0.25642-0.20128-0.62443-0.16719-0.93952 0.11566l-2.2589 2.0319-0.36678-0.18059c-0.25765-0.12783-0.5514-0.14812-0.82628-0.057219-0.082054 0.027189-0.15795 0.066147-0.22975 0.10997v-2.1524c0-2.5927-1.4208-5.0994-4.001-7.0595-2.3127-1.7572-5.2802-2.8062-7.9387-2.8062h-6.392c-2.6581 0-5.626 1.049-7.9391 2.8062-2.5798 1.9601-4.0001 4.4668-4.0001 7.0595v2.1374c-0.065643-0.038146-0.13457-0.070611-0.20842-0.09496-0.27488-0.090902-0.56822-0.070611-0.82628 0.057219l-0.36637 0.18059-2.2594-2.0319c-0.31468-0.28285-0.6831-0.31694-0.93911-0.11566-0.13252 0.1047-0.28473 0.31207-0.2478 0.70246l0.48576 5.1372c0.034463 0.36848 0.25724 0.66431 0.58053 0.77063 0.22237 0.073858 0.47345 0.050726 0.70607-0.063712l0.69869-0.34534 1.3194 2.6146c0.0065643 0.012986 0.016821 0.023943 0.023796 0.036929 0.0090259 0.022725 0.019693 0.045045 0.032001 0.066147 0.22934 0.40297 0.58956 0.67933 1.0015 0.84977v4.2626c0 0.071828 0.0077951 0.14244 0.022975 0.2098 0.11405 8.1584 6.8593 14.761 15.134 14.761 8.3461 0 15.135-6.7162 15.135-14.971 0-0.070205-0.0073848-0.13879-0.021334-0.20412v-4.0496c0.42053-0.16963 0.78936-0.44842 1.0228-0.85829 0.011898-0.021102 0.022975-0.043422 0.031591-0.066147 0.0077952-0.013392 0.017231-0.024349 0.024206-0.036929l1.3198-2.6146 0.69869 0.34534c0.23262 0.11444 0.4833 0.13757 0.70607 0.063712 0.32288-0.10673 0.54525-0.40216 0.58012-0.77063l0.48658-5.1372c0.036104-0.39039-0.11611-0.59776-0.24944-0.70246zm-16.007 7.7895c0.07672-0.077916 1.9254-1.9195 5.3163-2.4901 0.26216-0.043016 0.52145 0.09009 0.6351 0.32789l0.40822 0.85869c0.23057 0.48576 0.25683 1.0312 0.072618 1.536-0.1838 0.50483-0.55551 0.90861-1.0466 1.1367-0.023796 0.010957-0.047591 0.020696-0.072618 0.028407l-2.7197 0.85423c-0.026257 0.008522-0.053335 0.014609-0.080003 0.019073-0.10585 0.018261-0.21375 0.026784-0.32247 0.026784-1.0511 0-1.9291-0.84043-2.3004-1.6212-0.027898-0.058031-0.04595-0.12053-0.052925-0.18464-0.019693-0.17409 0.038565-0.36645 0.16247-0.49184zm-13.65-1.3039l0.40863-0.85869c0.11323-0.2378 0.37294-0.37091 0.63428-0.32789 3.3913 0.57016 5.24 2.4117 5.3171 2.4901 0.12349 0.1254 0.18175 0.31775 0.16247 0.49184-0.0073848 0.064118-0.025026 0.12661-0.052514 0.18464-0.37129 0.78078-1.2497 1.6212-2.3012 1.6212-0.1079 0-0.21662-0.0085221-0.32247-0.026784-0.026668-0.0044639-0.053335-0.010551-0.079592-0.019073l-2.7197-0.85423c-0.025026-0.0077104-0.049232-0.017044-0.073028-0.028407-0.49068-0.22807-0.86239-0.63185-1.0466-1.1367-0.18421-0.50483-0.15836-1.0498 0.072618-1.536zm9.9228 20.572c-6.1188 0-11.275-4.149-12.748-9.7516l2.3135 1.4138c0.18995 0.11687 0.40904 0.17774 0.63264 0.17774 0.20021 0 0.3996-0.049915 0.57479-0.14406l9.6159-5.1704 9.579 5.17c0.3795 0.20412 0.86403 0.18627 1.2263-0.044233l1.4052-0.89359c-1.6435 5.3425-6.6685 9.2423-12.599 9.2423zm-2.8969-34.1h5.517v1.4346h-1.851v4.3751h-1.815v-4.3751h-1.851v-1.4346z" />
						</g>
						<text font-family="HelveticaNeue-Medium, Helvetica Neue" font-size="20" font-weight="400">
							<tspan x="48" y="23">Travel</tspan>
							<tspan x="90" y="23" font-family="Arial-Black, Arial Black" fontWeight="700">Hero</tspan>
						</text>
					</g>
				</g>
			</svg>

		)
	}
};

const IconButtonExampleTouch = () => (
  <div style={{display:"flex", flex: 1, justifyContent: "center", alignItems: "center"}}>
    <IconButton tooltip="Favorite Destinations" touch={true} tooltipPosition="bottom-right" >
      <ActionGrade color={'white'} hoverColor={teal900}/>
    </IconButton>
  </div>
);


class Search extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			address: '',
			results: [],
			favorites: [
  [
    { distance: '0.4 mi',
      travel_time: '4 mins',
      type: 'bank',
      place_lat: 40.7501328,
      place_long: -73.97649899999999,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png',
      google_id: 'ChIJY9UK5gNZwokR60pPEpS1WKE',
      place_name: 'Chase Bank',
      rating: 3,
      place_address: '355 Lexington Ave, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/100338243655446815049/photos">Chase Bank</a>',
      price_level: '' },
    { distance: '0.5 mi',
      travel_time: '5 mins',
      type: 'bank',
      place_lat: 40.749611,
      place_long: -73.974712,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png',
      google_id: 'ChIJt5cK5gNZwokR4S9PcCtCTcQ',
      place_name: 'Chase Bank',
      rating: 4.5,
      place_address: '633 3rd Ave, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/107222874427432551066/photos">Christopher N Flores</a>',
      price_level: '' }
  ],
  [
    { distance: '0.3 mi',
      travel_time: '3 mins',
      type: 'supermarket',
      place_lat: 40.7522358,
      place_long: -73.9756911,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
      google_id: 'ChIJnaciOAJZwokR2eQCKWId9B8',
      place_name: 'Eli Zabar\'s',
      rating: 1,
      place_address: '89 East 42nd Street, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/101941738990436117323/photos">Gregory Weiss</a>',
      price_level: '' },
    { distance: '0.7 mi',
      travel_time: '6 mins',
      type: 'supermarket',
      place_lat: 40.74663890000001,
      place_long: -73.977746,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
      google_id: 'ChIJw7VKFwRZwokRVJgwZnK-eEY',
      place_name: 'D\'Agostino',
      rating: 3.2,
      place_address: '528 3rd Avenue, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/114435253726526221846/photos">Dijon Davantes</a>',
      price_level: '' }
  ]
],
			swapFaves: false
		}
		//this.props.location.prefs is the prefs object
		this.fetchClosestPlaces = this.fetchClosestPlaces.bind(this)
		this.handleAddressState = this.handleAddressState.bind(this)
		this.saveFavorite = this.saveFavorite.bind(this)
		this.swapSeachtoFavorites = this.swapSeachtoFavorites.bind(this)
	}

	fetchClosestPlaces(){
		let params = {
			address: this.state.address,
			newPrefs: this.props.location.prefs,
			savedPrefs: this.props.location.savedPrefs ? this.props.location.savedPrefs.userData : undefined
		}
		// console.log('new prefs are', params.newPrefs)
		// console.log('savedprefs are', params.savedPrefs)

		axios.post('/places', {params: params})
		.then(({data}) => {
			this.setState({
				results: [data]
			});
		})
		.catch((err) => console.log('error in fetching places'))
	}

	handleAddressState(event) {
		this.setState({
			address: event.target.value
		}, console.log(this.state.address))
	}

	saveFavorite(place) {
		const params = {
			place: place,
			address: this.state.address,
			username: this.props.location.username,
			create_time: new Date()
		};
		axios.post('/save', {params: params})
			.then((resp) => {
					
				/*let fav = JSON.parse(resp.config.data)
				let newfaveState = this.state.favorites.slice();
				newfaveState.push(fav.params)

				this.setState({
					favorites: newfaveState
				});*/
		})
			.catch((err) => console.log('err trying to save fave is', err))
	}

	swapSeachtoFavorites(){
		this.setState({
			swapFaves: !this.state.swapFaves
		})
	}


	render() {
		return (
			<div>
				<AppBar title="Search the World" iconElementLeft={IconButtonExampleTouch()}>
					<img src={require('../assets/logo_inline.svg')} alt="My logo" />
				</AppBar>
				<Toolbar style={{
					height: 80,
				}} >
        <ToolbarGroup firstChild={true}>
						<Paper
							style={{
								height: `3.6rem`,
								width: `70rem`,
								margin: 20,
								paddingTop: `.8rem`,
								paddingBottom: `.8rem`,
								display: 'inline-flex',
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								textAlign: 'center',
								justifyContent: "left",
								alignItems: "center"
							}}
							zDepth={1}>

							<SearchIcon style={{paddingLeft: '1rem'}}/>
							<TextField
								hintText="Enter your destination"
								type="text"
								value={this.state.address}
								onChange={this.handleAddressState}
								fullWidth={true}
								inputStyle={{color: `black`}}
								underlineShow={false}
								style={{paddingLeft: '1rem'}}
								/>
						</Paper>
						<RaisedButton onClick={() => { this.fetchClosestPlaces() }}>Search</RaisedButton>
					</ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
					<RaisedButton primary={true} onClick={() => { this.swapSeachtoFavorites() }}>{this.state.swapFaves ? "Searches" : "Save All"}</RaisedButton>
        </ToolbarGroup>
      </Toolbar>
				{
					this.state.swapFaves ? this.state.favorites.map((result) => {
						return (
							result.map((place) => {
								return <Card>
									<CardHeader
										title={place.place_name}
										avatar={place.category_icon}
										subtitle={place.type}
										actAsExpander={true}
										showExpandableButton={true}
									/>
									<CardText expandable={true}>
										{place.place_address}<br></br>
										{place.distance}<br></br>
										{place.travel_time} <br></br>
									</CardText>
									<CardActions>
										<FlatButton onClick={() => { this.saveFavorite(place) }}>Save</FlatButton>
									</CardActions>
								</Card>
							})
						)
					}) :

						this.state.results.map((result) => {
							return (
								result.map((place) => {
									return <Card>
										<CardHeader
											title={place.place_name}
											avatar={place.category_icon}
											subtitle={place.type}
											actAsExpander={true}
											showExpandableButton={true}
										/>
										<CardText expandable={true}>
											{place.place_address}<br></br>
											{place.distance}<br></br>
											{place.travel_time} <br></br>
										</CardText>
										<CardActions>
											<FlatButton onClick={() => { this.saveFavorite(place) }}>Save</FlatButton>
										</CardActions>
									</Card>
								})
							)
						})
				}
			</div>
		)
	}
}
export default Search;