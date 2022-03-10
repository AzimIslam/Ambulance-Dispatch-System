import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import swal from "sweetalert2";

export default class Outcome extends Component {
    constructor(props) {
        super(props)
        this.state ={
            notes: "",
            dispatch: false,
            caseId: null,
            dispatchId: null
        }
        this.setNotes = this.setNotes.bind(this)
        this.setDispatch = this.setDispatch.bind(this)
        this.process = this.process.bind(this)
    }

    componentDidMount() {
        if(this.props.category1 || this.props.category2) this.setState({dispatch: true})
    }

    setNotes(notes) {
        this.setState({notes})
    }

    setDispatch() {
        this.setState({dispatch: !this.state.dispatch})
    }

    async process() {
        let category = this.props.category1 ? 1 : this.props.category2 ? 2: this.props.category3 ? 3: 4
        let req = {
            first_name: this.props.patientDetails.firstName,
            surname: this.props.patientDetails.surname,
            notes: this.props.caseDetails.notes,
            category: category,
            longitude: Number(this.props.patientDetails.lng),
            latitude: Number(this.props.patientDetails.lat),
            symptoms: this.props.caseDetails.symptoms,
            notes: document.getElementById("notes").value
        }

        await axios.post("/case/create", req)
        .then(caseRes => {
            this.setState({caseId: caseRes.data.id})
        })

        console.log(this.state.caseId)

        if (document.getElementById("tick").checked) {
            await axios.post("/dispatch/create", {case: this.state.caseId})
        }


        if (this.state.caseId != null || (this.state.dispatchId != null && document.getElementById("tick").checked)) {
            swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Case processed. Page will refresh in 5 seconds.'
            })
            setTimeout(() => window.location.href = "/dashboard", 5000)
        } else {
            swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'Data rejected by server. Please try again.'
            })
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.category1 ? <h3>Category 1 - Life-threatening illnesses or injuries</h3> :
                    this.props.category2 ? <h3>Category 2 - Emergency</h3> :
                    this.props.category3 ? <h3>Category 3 - Urgent</h3>
                    : <h3>Category 4 - Less Urgent</h3>
                }
                {
                    this.props.category1 ? 
                    <p>The system has categorised this case as a category one emergency, based on the questions you have answered.
                        Due to this case being an high category, we recommend to dispatch an ambulance.
                        Category one is about calls from people with life-threatening illnesses or injuries such as cardiac arrest or
                        serious allergic reactions.
                    </p> :
                    this.props.category2 ? 
                    <p>
                        The system has categorised this case as a category two emergency, based on the questions you have answered.
                        Due to this case being an high category, we recommend to dispatch an ambulance.
                        Category two is for emergency calls for conditions and injuries such as burns, epilepsy and strokes.
                    </p> :
                    this.props.category3 ? 
                    <p>
                        The system has categorised this case as a category three emergency, based on the questions you have answered.
                        Depending on the scenario, it may be recommended to dispatch a ambulance. Category three is for urgent calls such as late stages of labour, non-severe burns and diabetes. In some instances,
                        the patient can be treated at their home.
                    </p>
                    : <p>
                        The system has categorised this case as a category four emergency based on the questions you have answered.
                        Category four is for less urgent calls for conditions such as diarrohea, vomitting and urinal infection. In some
                        instances you can give advice over the telephone to patients or referred to another service such as a GP or pharmacist.
                        As this is a category four emergency, an ambulance dispatch may not be required.
                    </p>  
                }
                  <b>Symptoms of the Patient: </b>
                  {this.props.caseDetails.symptoms.length == 0 ? <p>There are no symptoms recorded</p>: <p></p>}
                  <ul>
                    {this.props.caseDetails.symptoms.map(symptom => <li>{symptom}</li>)}
                  </ul>
                  <Form onSubmit={(e) => {
                      e.preventDefault()
                      this.process()
                    }}>
                        <Form.Group>
                            <Form.Label>Additional Notes</Form.Label>
                            <Form.Control id="notes" onChange={(e) => this.setNotes(e.target.value)} as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Dispatch">
                                <Form.Check id="tick" onChange={() => this.setDispatch()} type="checkbox" checked={this.props.category1 || this.props.category2} label="Request Ambulance Dispatch" />
                        </Form.Group>
                        <Button type="submit" variant="primary">Process</Button>
                   </Form>
            </div>
        );
    }
}