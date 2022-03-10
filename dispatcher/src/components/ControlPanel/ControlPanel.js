import React, { Component } from 'react';
import { Sidebar } from './Sidebar';
import Case from './Case';
import { Route, Routes, Navigate } from "react-router"
import Home from "./Home"
import CreateCasePage from './CreateCase/CreateCasePage';
import axios from 'axios';
import ManageDispatch from './ManageDispatch';

import "bootstrap-icons/font/bootstrap-icons.css"
import Settings from './Settings';

const background = require('../../assets/login-background.jpg');

export class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }

    async componentDidMount() {
        await axios.get("/api/dispatcher/checkSession")
            .then(res => {
                this.setState({loggedIn: res.data.authenticated})
        })
    }

    render() {
            return (
                this.state.loggedIn ?
                <div id="app">
                    <Sidebar/>
                    <div style={{marginLeft: "5em", marginTop: "1em", height: "100%"}}>
                        <Routes>
                            <Route exact path="" element={<Home />} />
                            <Route exact path="createCase" element={<CreateCasePage />} />
                            <Route exact path="case/:id" element={<Case />} />
                            <Route exact path="manageDispatch" element={<ManageDispatch />} />
                            <Route exact path="settings" element={<Settings />} />
                        </Routes>
                    </div>
                </div>
                :   <div id="app" style={{backgroundImage: `linear-gradient(0deg, rgba(255 255 255 / 54%), rgba(255 0 150 / 69%)), url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundColor: "#add8e6", margin: 0}}>
                        <div className="mx-auto d-flex align-items-center justify-content-center align-content-center flex-column" style={{height: "100%"}}>
                            <h1 style={{color: "white", fontWeight: "bold", textAlign: "center"}}>Access Denied</h1>
                            <i class="bi bi-lock" style={{fontSize: "8em", color: "white"}}></i>
                            <p className="mt-2" style={{color: "white", fontWeight: "light", textAlign: "center", fontSize: "1.25em"}}>
                                It seems like you are not authenticated. Please log in, to access this page.
                            </p>
                        </div>
                    </div>
            )
        }
}