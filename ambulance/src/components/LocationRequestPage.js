import React, { Component } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"

const background = require('../assets/login-background.jpg');

export default class LocationRequest extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div id="app" style={{backgroundImage: `linear-gradient(0deg, rgba(255 255 255 / 54%), rgba(255 0 150 / 69%)), url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundColor: "#add8e6", margin: 0}}>
                <div className="mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                    <h1 style={{color: "white", fontWeight: "bold", textAlign: "center"}}>Enable Location Services</h1>
                    <i class="bi bi-geo-alt" style={{fontSize: "8em", color: "white"}}></i>
                    <p className="mt-2" style={{color: "white", fontWeight: "light", textAlign: "center", fontSize: "1.25em"}}>
                        This app requires access to location services. We need it so that the system is able to determine where you are.
                        This allows functionality such as allowing  to dispatch the nearest ambulances to patients.
                    </p>
                </div>
            </div>
        );
    }
}