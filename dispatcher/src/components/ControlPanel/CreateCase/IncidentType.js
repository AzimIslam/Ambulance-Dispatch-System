import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';

export default class IncidentType extends Component {
    constructor(props) {
        super(props)
        this.assess = this.assess.bind(this)
    }

    assess(e) {
        e.preventDefault()
        var radioBtns = document.getElementsByName("incident")
        for(let i = 0; i < radioBtns.length; i++) {
            if(radioBtns[i].checked) {
                if(i == 0) {
                    this.props.setState({type: false, injury: true})
                } else if (i == 1) {
                    this.props.setState({type: false, medical: true})
                }
                return
            }
        }
        alert("Please select a type of incident")
    }

    render() {
        return (
            <div style={{marginTop: "1em"}}>
                <label for="symptoms">Please select the type of incident</label>
                <Form>
                    <Form.Check
                        name="incident" 
                        type="radio"
                        id={`incident`}
                        label={`Injury/Trauma`}
                        required
                    />
                    <Form.Check
                        name="incident" 
                        type="radio"
                        id={`incident`}
                        label={`Medical Problems`}
                        required
                    />
                    <Button onClick={this.assess} style={{marginTop: "1em"}}>Next Stage</Button>
                </Form>
            </div>
        )
    }
}