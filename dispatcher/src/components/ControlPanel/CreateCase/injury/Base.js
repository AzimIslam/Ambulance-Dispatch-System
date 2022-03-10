import React, { Component } from 'react';
import CategoryOne from './CategoryOne';
import CategoryTwo from './CategoryTwo';
import CategoryThree from './CategoryThree';
import CategoryFour from './CategoryFour';
import Outcome from '../Outcome';

export default class Base extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cat1: true,
            cat2: false,
            cat3: false,
            cat4: false,
            complete: false,
            chosenCat: 0,
            symptoms: []
        }
    }

    render() {
        if(this.state.cat1) return <CategoryOne setState={(dict) => this.setState(dict)} />
        else if(this.state.cat2) return <CategoryTwo setState={(dict) => this.setState(dict)} />
        else if(this.state.cat3) return <CategoryThree setState={(dict) => this.setState(dict)} />
        else if (this.state.cat4) return <CategoryFour setState={(dict) => this.setState(dict)} />
        else {
            if (this.state.chosenCat == 1) return <Outcome patientDetails={this.props.patientDetails} category1={true} caseDetails={this.state}/>
            else if (this.state.chosenCat == 2) return <Outcome patientDetails={this.props.patientDetails} category2={true} caseDetails={this.state} />
            else if (this.state.chosenCat == 3) return <Outcome patientDetails={this.props.patientDetails} category3={true} caseDetails={this.state}/>
            else if (this.state.chosenCat == 4) return <Outcome patientDetails={this.props.patientDetails} category4={true} caseDetails={this.state}/>
        }
    }
}