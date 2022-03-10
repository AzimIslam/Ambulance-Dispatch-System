import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryTwo extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Severe flu-like symptoms or coughing up blood",
                    "Sudden charge in mental state or difficulty speaking",
                    "Sudden changes in vision",
                    "Persistent high fever - despite medication",
                    "​Young children who have stopped drinking and/ or passing urine",
                    "Any sudden, severe, especially in the abdomen or back",
                    "​Unusual headaches or migraines for the patient",
                    "Inability to urinate",
                    "Pain in pregnancy",
                    "Pregnancy - reduced movement",
                    "Pregnancy - ruptured membranes",
                    "Severe testicular pain"
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