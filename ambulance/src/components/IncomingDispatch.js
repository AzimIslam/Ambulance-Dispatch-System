import { Component } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";



export default class IncomingDispatch extends Component {
    constructor(props) {
        super(props)
        this.updateToDB = this.updateToDB.bind(this)
    }

    async updateToDB() {
        await axios.put('/dispatch/assignAmbulance', {assigned_case: this.props.case, assigned_ambulance: this.props.ambulance})
            .then((res) => console.log(res))
        this.props.acceptDispatch()
    }

    render() {
        return (
            <div className="mt-5 mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                <h1 style={{fontWeight: "bold", textAlign: "center"}}>Dispatch assigned</h1>
                <i class="bi bi-broadcast" style={{fontSize: "8em"}}></i>
                <h6>Category {this.props.caseData.category}</h6>
                <h6>Patient Name: {this.props.caseData.first_name} {this.props.caseData.surname}</h6>
                <h6>Address: {this.props.googleMaps.destination_addresses[0]}</h6>
                <h6>Distance: {this.props.googleMaps.rows[0].elements[0].distance.text}</h6>
                <h6>Estimated Journey Time: {this.props.googleMaps.rows[0].elements[0].duration.text}</h6>
                <Button onClick={this.updateToDB} className="mt-3" variant="primary">Start Dispatch</Button>
            </div>
        )
    }
}