import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {deepPurple500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LoginComponent from './components/login';
import Map from './components/map';
import axios from 'axios';

axios.defaults.baseURL = 'https://cobbles.anryze.com';

const muiTheme = getMuiTheme({
    palette: {
        primaryColor: deepPurple500,
        primary1Color: deepPurple500
    }
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme} className="App">
                <Router>
                    <div className="container">
                        <Route exact path="/" component={LoginComponent}/>
                        <Route path="/map" component={Map}/>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
