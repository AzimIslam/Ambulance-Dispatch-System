import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';
import Outcome from '../Outcome';

export default class CategoryOne extends Component {
    constructor(props) {
        super(props)
            this.state = {
                symptoms: [
                    "Respiratory and/or Cardiac Arrest",
                    "Chest pain or tightness (Chest pain lasting longer than 20 minutes or that is associated with sweating, shortness of breath or radiation to another part of the body e.g. arm, is to be considered a ‘heart attack’ until proven otherwise, regardless of the age of the patient).​",
                    "Severe heart palpitations",
                    "Sudden onset of weakness, numbness or paralysis of the face arm or leg",
                    "Severe breathing difficulties unable to speak in sentences",
                    "​Unconsciousness",
                    "Vomiting blood",
                    "Sudden collapse or unexplained fall",
                    "Unexplained fitting in adults",
                    "Infant/toddler that is fitting",
                    "Severe pain for any reason",
                    "Any overdose, poisoning or attempted suicide",
                    "A bite or sting from any large spider, snake or suspected venomous creature",
                    "A suspected severe allergic reaction/ anaphylaxis",
                    "Seizure without a previous diagnosis of epilepsy",
                    "Seizures that are frequent and/ or repeating in an epileptic patient",
                    "Fainting"
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
                    {this.state.symptoms.map(symptom => <Form.Check name="symptom" type="checkbox" label={symptom} />)}
                    
                    <Button onClick={this.assess} style={{marginTop: "1em"}}>Next Stage</Button>
            </div>
        )
    }
}