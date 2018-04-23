import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch, History} from "react-router-dom";

import Login from './components/Login.jsx';
import Search from './components/Search.jsx';
import Preferences from './components/Preferences.jsx';
import Favorites from './components/Favorites.jsx';
import Signup from './components/Signup.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { getMuiTheme, lightBaseTheme, darkBaseTheme } from 'material-ui/styles';
import {cyan500, grey300, teal500, teal900} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.makeMuiTheme = this.makeMuiTheme.bind(this);
  }

  makeMuiTheme() {
    return getMuiTheme({
      palette: {
        primary1Color: teal500,
        primary2Color: teal500,
        textColor: `#757575`,
        borderColor: cyan500
      },
      appBar: {
        height: 80,
        display:"flex", 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        titleStyle: {
          display:"flex", 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center",
        }
      }
    })
  }

  render () {

    return (

      <div>
        <MuiThemeProvider muiTheme={this.makeMuiTheme()}>
          <Router>
          <Switch>
              <Login exact path="/" component={Login}/>
              <Preferences  path="/preferences" component={Preferences}/>
              <Search path="/search" component={Search}/>
              <Signup path="/signup" component={Signup}/>
          </Switch>
          </Router> 
          </MuiThemeProvider>
      </div>

      )
   }
}


ReactDOM.render(<App/>, document.getElementById('app'));