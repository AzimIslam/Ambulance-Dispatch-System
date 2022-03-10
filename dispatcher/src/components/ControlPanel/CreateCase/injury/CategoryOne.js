import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class CategoryOne extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Uncontrollable bleeding",
                    "Assault with any weapon",
                    "Injuries caused by motor vehicle accident >60km/h, including pedestrian or cyclist >30km/h",
                    "Fall from greater than own height",
                    "Suspected spinal injury",
                    "​Severe burns (bigger than patient's hand) or deeper than top layers"
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
            this.props.setState({cat1: false, cat2: true})
        } else {
            this.props.setState({complete: true, chosenCat: 1, cat1: false, symptoms: this.state.selected})
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