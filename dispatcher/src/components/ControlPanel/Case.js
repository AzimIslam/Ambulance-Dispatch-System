import React, { Component } from "react";
import axios from "axios";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class Case extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: {},
            symptoms: [],
            dispatchInfo: {},
            address: "",
            eta: "N/A",
            ambulanceLocation: {}
        }
    }

    async componentDidMount() {
        await this.setState({id: window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)})
        await axios.get(`/case/getDetails/${this.state.id}`)
            .then(res => this.setState({patient: res.data.case}))
            
        await axios.get(`/dispatch/getDispatchFromCase/${this.state.id}`)
            .then(res => this.setState({dispatchInfo: res.data.dispatch}))

        await axios.get(`/case/getAddress/${this.state.id}`)
            .then(res => this.setState({address: res.data.address}))

        let temp = []
    
        for(let i = 0; i < this.state.patient.symptoms.length; i++) {
            temp.push(this.state.patient.symptoms[i])
        }

        this.setState({symptoms: temp})

        await axios.get(`/dispatch/getETA/${this.state.id}`)
        .then(res => this.setState({eta: res.data.eta}))
        .catch(() => this.setState({eta: "N/A"}))
    }

    render() {
        const style = {
            width: '100%',
            height: '100%'
        }
        return (
            <div>
                <h1>{this.state.patient.first_name} {this.state.patient.surname}</h1>
                <div style={{display: 'inline-block', width: '40%', overflow: 'auto'}}>
                    <table className="table" style={{width: '90%', marginRight: '1em', marginTop: '1em'}}>
                        <tbody style={{textAlign: 'center'}}>
                            <tr>
                                <th>First Name</th>
                                <td>{this.state.patient.first_name}</td>
                            </tr>
                            <tr>
                                <th>Surname</th>
                                <td>{this.state.patient.surname}</td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>{this.state.patient.category}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{this.state.address}</td>
                            </tr>
                            <tr>
                                <th>Symptoms</th>
                                <td>
                                    <select style={{width: "75%"}} class="form-select mx-auto" size="3" aria-label="size 3 select example">
                                    {
                                        this.state.symptoms.map(s => <option>{s}</option>)
                                    }
                                    </select>  
                                </td>
                            </tr>
                            <tr>
                                <th>Notes</th>
                                <td>{this.state.patient.notes}</td>
                            </tr>
                            <tr>
                                <th>Assigned Ambulance</th>
                                <td>{this.state.dispatchInfo.assigned_ambulance ? "Yes" : "No" }</td>
                            </tr>
                            <tr>
                                <th>Estimated Arrival Time</th>
                                <td>{this.state.eta}</td>
                            </tr>
                            <tr>
                                <th>Completed</th>
                                <td>{this.state.dispatchInfo.completed ? "Yes" : "No" }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Map 
                    containerStyle={
                        {
                            width: '50%', 
                            height: '90%', 
                            overflow: 'none', 
                            display: 'inline-block'
                        }
                    }
                    center={
                        {
                            lat: this.state.patient.latitude,
                            lng: this.state.patient.longitude
                        }
                    } 
                    initialCenter={
                        {
                            lat: this.state.patient.latitude,
                            lng: this.state.patient.longitude
                        }
                    } 
                    style={style} 
                    google={this.props.google}
                >
                    <Marker name="Patient" position={{lng: this.state.patient.longitude, lat: this.state.patient.latitude}}/>
                </Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAqXRStW5UDf3cnBQ5EWzd0czDCmlezFAg"
  })(Case)