import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryFour extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Back Pain - associated with an accident (e.g. fall, MVA, lifting) provided the patient has no loss of feeling or function in a limb and no loss of bladder or bowel control.",
                ],
                selected: []
            }
        this.assess = this.assess.bind(this)
    }

    assess() {
        let checkboxes = document.getElementsByName("symptom")
        for(let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                this.state.selected.push(this.state.symptoms[i])
            }
        }
        this.props.setState({complete: true, chosenCat: 4, cat4: false, symptoms: this.state.selected})
    }

    render() {
        return (
            <div style={{marginTop: "1em"}}>
                <label for="symptoms">Does the patient have any of these symptoms?</label>
                {
                    this.state.symptoms.map(symptom => <Form.Check name="symptom" type="checkbox" label={symptom} />)
                }
                <Button onClick={this.assess} style={{marginTop: "1em"}}>Next Stage</Button>
            </div>
        )
    }
}