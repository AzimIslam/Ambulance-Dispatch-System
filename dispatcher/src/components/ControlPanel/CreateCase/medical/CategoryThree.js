import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryThree extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Bites and Stings - if there difficulty breathing or the bite is from a any large black spider or any snake or known venomous creature, the patient should be directed to Ambulance OOO",
                    "Abdominal Pain - if the abdominal pain is so severe that it changes the patient's posture i.e. they must walk bent over or lie with their knees drawn to their chest; this is highly suggestive of referral directly to an Emergency Department.​",
                    "Convulsions/Fitting (not current)",
                    "​Limb Pain (without injury)",
                    "Eye or vision problems -  any obvious injury to the eye or an embedded object or sudden loss of sight or the quality of sight; this is highly suggestive of referral directly to an Emergency Department.",
                    "Suspected Meningitis - concern by parent or carer",
                    "Mental Health Problems ​or Extreme Anxiety - including suicide ideation",
                    "Severe pain (from any cause not mentioned in Ambulance or ED lists)",
                    "Burns/Scalds - if any part of the burn is black or charred or the burnt area is bigger than the patients hand; this is highly suggestive of referral directly to an Emergency Department.",
                    "Adverse Reaction to Medication",
                    "Fevers in infants (hot to touch)  - especially newborn to 3 months",
                    "Vaginal bleeding in pregnancy",
                    "Persistent vomiting"
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