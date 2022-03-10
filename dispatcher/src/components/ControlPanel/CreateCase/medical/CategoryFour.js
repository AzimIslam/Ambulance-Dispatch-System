import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryFour extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Swollen Limb",
                    "Under-dose - including missed dose",
                    "Sudden Rash - without other symptoms",
                    "Unwell Child (<3yo) or Elderly Patient (>65yo) - with persistent symptoms (>48hrs) such as fever, vomiting, diarrhoea, cough)",
                    "Adult Vomiting and/or Diarrhoea for > 72 hrs",
                    "Eye Problems",
                    "Ear Pain - despite pain relief >48 hrs",
                    "Fever in Adults - who are otherwise well",
                    "Flu-like symptoms - with current symptoms of risk",
                    "Post-operative Problems - if there is active bleeding DISCUSS WITH GP OR NURSE NOW",
                    "Urinary Problems - but able to urinate ",
                    "Wound Infection"
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