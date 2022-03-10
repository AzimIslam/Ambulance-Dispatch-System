import { Component } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css"
import IncomingDispatch from "./IncomingDispatch";
import Dispatch from "./Dispatch"
import swal from "sweetalert2";

import "bootstrap-icons/font/bootstrap-icons.css"
import LocationRequest from "./LocationRequestPage";
const background = require('../assets/login-background.jpg');


export default class ControlPanel extends Component {
    constructor(props) {
        super(props)
        this.socket = io.connect();
        this.state = {
            assigned_case: null,
            googleMaps: {},
            caseData: {},
            connected: false,
            accepted: false,
            locationEnabled: false
        }
        this.acceptDispatch = this.acceptDispatch.bind(this)
    }

    async logout() {
        await axios.post("/api/ambulance/logout")
            .then(res => window.location.href = "/ambulance/")
    }

    acceptDispatch() {
        this.setState({accepted: true})
    }

    async componentDidMount() {
        await axios.get("/api/ambulance/checkSession")
        .then(res => {
            this.setState({id: res.data.user_id})
        })

        if (this.state.id) {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition((position) => {
                    this.setState({locationEnabled: true})
                    const request = {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    }
                    axios.post('/location/send', request)
                })
            }

            if(!this.state.connected) {
                this.socket.on('connect', data => {
                    this.socket.emit('ambulanceLogin', { ambulanceId: this.state.id, busy: false, assigned_case: this.state.assigned_case});
                })
                this.setState({connected: true})
            }

            setInterval(() => {
                this.socket.emit('request dispatch')
                this.socket.on('assign dispatch', (data) => {
                    if (data.assigned_case) {
                        this.setState({assigned_case:  data.assigned_case, googleMaps: data.googleMaps, caseData: data.dispatch})
                        console.log(this.state.caseData)
                    } else{
                        if (this.state.accepted && data.cancelRequest) {
                            swal.fire({icon: 'error', title: 'Cancellation request', text: 'This dispatch has been cancelled'})
                        }
                        this.setState({accepted: false})
                        this.setState({assigned_case: null, googleMaps: {}, caseData: {}})
                    }
                })
            }, 1000)
        }
    }

    render() {
        if(this.state.id) {
            if(this.state.locationEnabled) {
                return (
                        <div>
                            <Navbar bg="primary" variant="dark">
                                <Container>
                                    <Navbar.Brand className="mx-auto" style={{fontWeight: "bold", textTransform: "uppercase"}}>Ambulance Menu</Navbar.Brand>
                                </Container>
                                <a onClick={this.logout}>
                                    <i class="bi bi-box-arrow-right" style={{fontSize: "1.5em", color: "white", marginRight: "1em"}}></i>
                                </a>
                            </Navbar>
                            { 
                            this.state.accepted == true ?
                            <Dispatch mapData={this.state.googleMaps} patientData={this.state.caseData} />
                            : this.state.assigned_case == null ?
                            <div className="mt-5 mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                                <h1 style={{fontWeight: "bold", textAlign: "center"}}>There are currently no dispatches</h1>
                                <i class="bi bi-broadcast" style={{fontSize: "8em"}}></i>
                                <p className="mt-2" style={{ fontWeight: "light", textAlign: "center", fontSize: "1.25em"}}>
                                    Please standby while the system is processing dispatches...
                                </p>
                            </div>
                            : <IncomingDispatch acceptDispatch={this.acceptDispatch} ambulance={this.state.id} case={this.state.assigned_case} googleMaps={this.state.googleMaps} caseData={this.state.caseData} />
                            }
                        </div>
                )
            }
            else {
                return <LocationRequest />
            }
        } else {
            return (
                <div id="app" style={{backgroundImage: `linear-gradient(0deg, rgba(255 255 255 / 54%), rgba(255 0 150 / 69%)), url(${background})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundColor: "#add8e6", margin: 0}}>
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
}