import React from 'react';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { Route , withRouter1} from 'react-router-dom';
import {Router} from 'react-router-dom';
import { withRouter } from "react-router";

import { createHashHistory } from 'history';

//"proxy": "http://128.4.30.6:5000"

//import MainContainer from "./components/MainContainer/MainContainer";


import MainContainer from '../MainContainer/MainContainer';
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";

var selectedTab;

let serverURL = "http://localhost:3000/";

export const history = createHashHistory();

class LoginSecond extends React.Component {

    constructor(props) {
        super(props);

        this.username = '';
        this.password = '';

        this.submitClicked = this.submitClicked.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);

    }

    submitClicked = () => {
        let username = this.username;
        let password = this.password;

        axios.get(serverURL + 'authenticate', {mode: 'no-cors', auth: {username, password}})
            .then(response => {
                console.log('Here');
                if (response.data == 5) {

                    console.log('admin here');
                    this.props.history.push({pathname: '/mainContainerAdmin', search: '?query=abc', state: { detail: response.data }})

                } else if (response.data == 6 || response.data == 7) {
                    console.log('checker here');
                    this.props.history.push({pathname: '/mainContainerAnnChecker', search: '?query=abc', state: { detail: response.data }})

                } else if (response.data == 8) {
                    console.log('readonly here');
                    this.props.history.push({pathname: '/mainContainerReadOnly', search: '?query=abc', state: { detail: response.data }})
                }
                else {this.props.history.push({pathname: '/mainContainer', search: '?query=abc', state: { detail: response.data }})}
            })
            .catch(err => alert("Sign-in Failed!"));

    };

    setUsername(value) {
        this.username = value;
    }

    setPassword(value) {
        this.password = value;
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form  noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            onChange={e => this.setUsername(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => this.setPassword(e.target.value)}
                        />
                        <Button
                            //type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            //className={classes.submit}
                            onClick = {this.submitClicked}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }

}



export default LoginSecond;