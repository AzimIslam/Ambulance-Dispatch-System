import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inProgressDispatches: 0,
            pendingDispatches: 0,
            activeAmbulances: 0,
            casesCreated: 0,
            recentCases: [],
            availableAmbulances: []
        }
    }

    async componentDidMount() {
        await axios.get('/api/dispatcher/getTodayCases')
            .then((res) => this.setState({casesCreated: res.data.count}))
        await axios.get('/api/dispatcher/getRecentCases')
            .then((res) => this.setState({recentCases: res.data.cases}))
        await axios.get('/api/dispatcher/getPendingDispatches')
            .then((res) => this.setState({pendingDispatches: res.data.count}))
        await axios.get('/api/dispatcher/getInProgressDispatches')
            .then((res) => this.setState({inProgressDispatches: res.data.count}))
        await axios.get('/api/getAmbulanceCount')
            .then((res) => this.setState({activeAmbulances: res.data.count}))
    }

    render() {
        return (
            <div>
            <h1 style={{margin: "0.5em"}}>Your dashboard</h1>
                <div className="container-fluid d-flex flex-wrap">
                    <Card className="text-left m-3 p-4" style={{width: "23%"}}>
                        <h5>Pending Dispatches</h5>
                        <h3>{ this.state.pendingDispatches }</h3>
                    </Card>
                    <Card className="text-left m-3 p-4" style={{width: "23%"}}>
                        <h5>Dispatches In Progress</h5>
                        <h3>{ this.state.inProgressDispatches }</h3>
                    </Card>
                    <Card className="text-left m-3 p-4" style={{width: "23%"}}>
                        <h5>Active Ambulances</h5>
                        <h3>{ this.state.activeAmbulances }</h3>
                    </Card>
                    <Card className="text-left m-3 p-4" style={{width: "23%"}}>
                        <h5>Cases created today</h5>
                        <h3>{ this.state.casesCreated }</h3>
                    </Card>
                    <Card className="text-left m-3 p-4" style={{width: "90%"}}>
                        <h5>Recent Cases</h5>
                        { (this.state.recentCases.length > 0) 
                            ? <Table responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Patient Name</th>
                                        <th colSpan={2}>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.entries(this.state.recentCases).map(([key, value]) => (
                                        <tr style={{margin: "200em"}}key={key}>
                                            <td>
                                                <a href={"/dispatcher/dashboard/case/"+value.id}>{value.id}</a>
                                            </td>
                                            <td>{value.patient}</td>
                                            <td>{value.category}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            : <p>You have not created any cases</p> 
                        }

                    </Card>
                </div>
            </div>
        )
    }
}