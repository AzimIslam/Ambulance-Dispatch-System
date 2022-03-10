import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryTwo extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Broken bones or dislocated joints - deformed or not in normal alignment",
                    "Deep cuts that require sutures - especially on the face",
                    "Head injuries - where there has been a loss of consciousness or persistent dizziness and/or vomiting",
                    "Anything impaled in any part of the body",
                    "Burns to the face or genitals",
                    "Cuts with exposed tissue underneath or where the feeling or temperature of the part is not normal",
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

        if (this.state.selected.length == 0) {
            this.props.setState({cat2: false, cat3: true})
        } else {
            this.props.setState({complete: true, chosenCat: 2, cat2: false, symptoms: this.state.selected})
        }
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