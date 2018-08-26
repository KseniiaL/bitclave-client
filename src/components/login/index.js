import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
    RaisedButton,
    Paper,
    TextField
} from 'material-ui';
import axios from 'axios';

import './index.scss';

class LoginComponent extends Component {
    constructor() {
        super();

        this.state = {
            values: {
                email: '',
                password: ''
            }
        }
    }

    handleChange = (val, e) => {
        switch (val) {
            case 'email':
                this.setState({
                    values: {
                        ...this.state.values,
                        email: e.target.value
                    }
                });
                break;
            case 'password':
                this.setState({
                    values: {
                        ...this.state.values,
                        password: e.target.value
                    }
                });
                break;
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/signin/vendor', this.state.values)
            .then(res => {
                localStorage.setItem('accessToken', res.data.refreshToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                document.getElementById('to-map').click();
            })
            .catch(err => {
                if (err.response.data.message) {
                    alert(err.response.data.message);
                }
            })
    };

    render() {
        return (
            <form className="login-page" onSubmit={this.handleSubmit}>
                <Paper className="login-page__container" zDepth={1}>
                    <h3 style={{marginBottom: 0}}>Sign In to Tranquility BASE</h3>
                    <div>
                        <TextField
                            autoComplete="false"
                            required
                            hintText="Email"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                            value={this.state.values.email}
                            onChange={this.handleChange.bind(this, 'email')}
                            floatingLabelText="Email"
                        /><br />
                        <TextField
                            autoComplete="false"
                            required
                            type="password"
                            hintText="Password"
                            pattern=".{6,}"
                            onChange={this.handleChange.bind(this, 'password')}
                            value={this.state.values.password}
                            floatingLabelText="Password"
                        /><br /><br/>
                    </div>
                    <RaisedButton type="submit" style={{width: '30%'}} primary label="Sign In"/>
                    <Link to="/map" id="to-map"/>
                </Paper>
            </form>
        );
    }
}

export default LoginComponent;