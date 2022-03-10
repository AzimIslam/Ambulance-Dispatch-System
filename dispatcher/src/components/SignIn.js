import React, { Component } from 'react';
import { SignInBox } from './SignInBox';
import { Container } from 'react-bootstrap';
import axios from "axios";
import swal from "sweetalert2";
import { Navigate } from 'react-router';

const background = require('../assets/login-background.jpg')

export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        }
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.login = this.login.bind(this)
    }

    setUsername(username) {
        this.state.username = username
    }

    setPassword(password) {
        this.state.password = password
    }

    login() {
        axios.post('/api/dispatcher/login', this.state)
        .then(res => {
            this.setState({isLoggedIn: res.data.authenticated})
        }).catch(error => {
            swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: error.response.data.msg
            })
        })
    }

    componentDidMount() {
        axios.get("/api/dispatcher/checkSession")
        .then(res => {
            this.setState({isLoggedIn: res.data.authenticated})
        })
    }

    render() {
        return(
            this.state.isLoggedIn ? <Navigate to="/dispatcher/dashboard" /> :
            <div id="app" style={{backgroundImage: `linear-gradient(0deg, rgba(255 255 255 / 54%), rgba(255 0 150 / 69%)), url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundColor: "#add8e6"}}>
                <Container style={{height: "100%"}} className="d-flex align-items-center justify-content-center align-content-center flex-column">
                    <SignInBox setUsername={this.setUsername} setPassword={this.setPassword} login={this.login}/>
                </Container>
            </div>
        )
    }
}
