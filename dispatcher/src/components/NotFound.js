import React, { Component } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"

const background = require('../assets/login-background.jpg');

export default class NotFound extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div id="app" style={{backgroundImage: `linear-gradient(0deg, rgba(255 255 255 / 54%), rgba(255 0 150 / 69%)), url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundColor: "#add8e6", margin: 0}}>
                <div className="mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                    <h1 style={{color: "white", fontWeight: "bold", textAlign: "center"}}>Page Not Found</h1>
                    <i class="bi bi-question-lg" style={{fontSize: "8em", color: "white"}}></i>
                    <p className="mt-2" style={{color: "white", fontWeight: "light", textAlign: "center", fontSize: "1.25em"}}>
                        This page does not exist. Please go back to the main page and authenticate.
                    </p>
                </div>
            </div>
        );
    }
}