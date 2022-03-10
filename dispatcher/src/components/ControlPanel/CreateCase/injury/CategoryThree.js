import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryThree extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Cuts - if the bleeding cannot be controlled or is from an body orifice or is longer than 20mm or if there is white or yellow substances visible in the wound; this is highly suggestive of referral directly to an Emergency Department. ",
                    "Limb Injury -  the limb is deformed or not in normal alignment or is pale compared to the other limb or there is a loss of function or feeling in the limb or the patient cannot bear weight/walk; this is highly suggestive of referral directly to an Emergency Department.​"
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
            this.props.setState({cat3: false, cat4: true})
        } else {
            this.props.setState({complete: true, chosenCat: 3, cat3: false, symptoms: this.state.selected})
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