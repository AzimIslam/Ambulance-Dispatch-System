import React, { Component } from 'react';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';
import swal from "sweetalert2";


export default class ManageDispatch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatches: []
        }
        this.cancelDispatch = this.cancelDispatch.bind(this)
    }

    async componentDidMount() {
        await axios.get('/dispatch/getAllDispatches')
        .then((res) => {
            this.setState({dispatches: res.data.dispatches})
        })
    }
    
    async cancelDispatch(id) {
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              await axios.delete('/dispatch/delete', {id})
                .then(res => {
                if (res.data.status == 'OK') {
                    this.setState({dispatches: this.state.dispatches.filter(d => d.id != id)})
                    swal.fire(
                        'Cancelled!',
                        'The dispatch for this case has been cancelled.',
                        'success'
                    )
                } else {
                    swal.fire(
                        'Error',
                        'An error occurred. Please try again later.',
                        'error'
                    )
                }
            })
            }
        })
    }

    render() {
        return( 
        <div>
            <h1 style={{margin: "0.5em"}}>Manage Dispatch</h1>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient Name</th>
                        <th>Address</th>
                        <th>Assigned Ambulance</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.dispatches.length == 0 ? <p style={{margin: "1em"}}>There are no active dispatches</p>
                    : this.state.dispatches.map((value) => (
                        <tr style={{margin: "200em"}}key={value.id}>
                            <td>
                                <a href={"/dispatcher/dashboard/case/"+value.id}>{value.id}</a>
                            </td>
                            <td>{value.name}</td>
                            <td>{value.addr}</td>
                            <td>{value.assigned ? "Yes" : "No"}</td>
                            <td>{value.cat}</td>
                            <td>
                                <Button onClick={() => this.cancelDispatch(value.id)} variant="danger">Cancel</Button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </div>
        )
    }
}