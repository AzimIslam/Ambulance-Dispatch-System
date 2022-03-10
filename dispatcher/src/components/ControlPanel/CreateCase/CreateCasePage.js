import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import IncidentType from './IncidentType';
import Injury from './injury/Base';
import Medical from './medical/Base'
import Map from './Map'

export default class CreateCasePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            surname: "",
            age: 0,
            lng: 0,
            lat: 0,
            onForm: true,
            type: false,
            injury: false,
            medical: false,
            other: false,
        }
        this.startTriage = this.startTriage.bind(this)
        this.propSetState = this.propSetState.bind(this)
    }

    startTriage(e) {
        e.preventDefault()
        console.log(this.state)
        this.setState({onForm: false, type: true})
    }

    propSetState(dict) {
        this.setState(dict)
    }


    render() {
        return ( 
            <div class="flex" style={{margin: "0.5em"}}>

                <h1>Create Case</h1>
                    { this.state.onForm ?
                    <div>
                    <h5 style={{marginTop: "1em"}}>Please ask for the patient details such as their name, patient number or postcode. The system will automatically
                        find the patient and assign it to the case. If the details are not on the system, details about the patient will need to be added as a note.</h5>
                    <Form onSubmit={this.startTriage} style={{marginTop: "2em", width: "40%", height: "100%"}}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control onChange={(e) => this.setState({firstName: e.target.value})} type="text" placeholder="John" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="surname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control onChange={(e) => this.setState({surname: e.target.value})} type="text" placeholder="Smith" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control onChange={(e) => this.setState({age: e.target.value})} type="number" placeholder="65" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Location of Incident</Form.Label>
                            <Map setState={this.propSetState} lng={-0.118092} lat={51.509865} />
                        </Form.Group>
                        <Button class="mt-5" id="btn-submit" type="submit" variant="primary">Start Triage</Button>
                        </Form>
                    </div>:
                    this.state.type ? <IncidentType setState={this.propSetState} />
                    : this.state.injury ? <Injury patientDetails={this.state} />
                    : this.state.medical ? <Medical patientDetails={this.state} />
                    : <h1>Hello world</h1>
            }
            </div>
        )
    }
}