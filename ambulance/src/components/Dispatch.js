import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css"
import swal from "sweetalert2";
import axios from 'axios';
import Swal from 'sweetalert2';

export default class Dispatch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            appleMaps: "",
            waze: "",
            googleMaps: "",
            show: false,
            modalHeader: "",
            hospitalLat: 0.0,
            hospitalLng: 0.0
        }
        this.openAppleMaps = this.openAppleMaps.bind(this)
        this.openGoogleMaps = this.openGoogleMaps.bind(this)
        this.openWaze = this.openWaze.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.showSymptoms = this.showSymptoms.bind(this)
        this.showNotes = this.showNotes.bind(this)
        this.navigateToPatient = this.navigateToPatient.bind(this)
        this.navigateToHospital = this.navigateToHospital.bind(this)
        this.endDispatch = this.endDispatch.bind(this)
    }

    async componentDidMount() {
        axios.get('/api/ambulance/getHospital')
            .then(res => this.setState({hospitalLat: res.data.lat, hospitalLng: res.data.lng}))
    }

    navigateToPatient() {
        this.setState({modalHeader: "Navigate to Patient"})
        this.handleShow()
    }

    navigateToHospital() {
        this.setState({modalHeader: "Navigate to Hospital"})
        this.handleShow()
    }

    showNotes() {
        if (this.props.patientData.notes.length == 0) {
            swal.fire({
                icon: 'info',
                title: 'Notes',
                text: 'There are no notes to view for this patient'
            })
        } else {
            this.setState({modalHeader: "Notes"})
            this.handleShow()
        }
    }

    handleShow() {
        this.setState({show: true})
    }

    handleClose() {
        this.setState({show: false})
    }

    showSymptoms() {
        this.setState({modalHeader: "Symptoms"})
        this.handleShow()
    }

    openGoogleMaps() {
        this.props.travel()
        if(this.state.modalHeader == "Navigate to Patient") window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${this.props.patientData.latitude},${this.props.patientData.longitude}`)
        else window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${this.state.hospitalLat},${this.state.hospitalLng}`)
    }

    async endDispatch() {
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'End Dispatch',
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.put('/dispatch/markComplete', {case: this.props.patientData._id})
                    .then(res => console.log(res))
                Swal.fire(
                  'Dispatch Complete',
                  'You have marked the dispatch as complete',
                  'success'
                )
              }
        })
    }

    openAppleMaps() {
        this.props.travel()
        if(this.state.modalHeader == "Navigate to Patient") window.open(`https://maps.apple.com/maps?q=Patient%20Location&ll=${this.props.patientData.latitude},${this.props.patientData.longitude}&dirflg=d&t=h`)
        else window.open(`https://maps.apple.com/maps?q=Hospital&ll=${this.state.hospitalLat},${this.state.hospitalLng}&dirflg=d&t=h`)
    }

    openWaze() {
        this.props.travel()
        if(this.state.modalHeader == "Navigate to Patient") window.open(`https://www.waze.com/ul?ll=${this.props.patientData.latitude}%2C${this.props.patientData.longitude}&navigate=yes&zoom=17`)
        else window.open(`https://www.waze.com/ul?ll=${this.state.hospitalLat}%2C${this.state.hospitalLng}&navigate=yes&zoom=17`)
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalHeader == "Symptoms" ?
                         this.props.patientData.symptoms.map((symptom) => <p>{symptom}</p>)
                         : this.state.modalHeader == "Notes" ? <p>{this.props.patientData.notes}</p>
                         : <div className="mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                             <Button onClick={this.openWaze} className="mt-2" variant="info"><i class="bi bi-pin-map-fill" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>Navigate using Waze</Button>
                             <Button onClick={this.openGoogleMaps} className="mt-2" variant="primary"><i class="bi bi-google" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>Navigate using Google Maps</Button>
                             <Button onClick={this.openAppleMaps}className="mt-2" variant="light"><i class="bi bi-apple" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>Navigate using Apple Maps</Button>
                           </div>  
                        }
                    </Modal.Body>
                </Modal>
                <div className="mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                    <h1 className="mt-3">Category {this.props.patientData.category} Emergency</h1>
                    <h6>Patient Name: {this.props.patientData.first_name} {this.props.patientData.surname}</h6>
                    <h6>Address: {this.props.mapData.destination_addresses[0]}</h6>
                    <h6>Distance: {this.props.mapData.rows[0].elements[0].distance.text}</h6>
                    <h6>Estimated Journey Time: {this.props.mapData.rows[0].elements[0].duration.text}</h6>
                    <div className="mt-3 mx-auto d-flex align-items-center justify-content-center align-content-center flex-column">
                        <Button onClick={this.showSymptoms} className="mt-2"><i class="bi bi-thermometer-high" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>View Symptoms</Button>
                        <Button onClick={this.showNotes} className="mt-2"><i class="bi bi-card-text" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>View Notes</Button>
                        <Button onClick={this.navigateToPatient} variant="success" className="mt-2"><i class="bi bi-person-circle" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>Navigate to Patient</Button>
                        <Button onClick={this.navigateToHospital} variant="primary" className="mt-2"><i class="bi bi-bandaid" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>Navigate to Hospital</Button>
                        <Button onClick={this.endDispatch} variant="danger" className="mt-2"><i class="bi bi-x-circle-fill" style={{marginRight: "0.5em", fontSize: "1.25em"}}></i>End Dispatch</Button>
                    </div>
                </div>
            </div>
        )
    }
}