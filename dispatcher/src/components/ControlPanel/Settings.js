import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import swal from "sweetalert2";

export default class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            firstName: "",
            surname: "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
        this.changePassword = this.changePassword.bind(this)
    }

    async componentDidMount() {
        await axios.get('/api/dispatcher/getSettings')
            .then(res => this.setState({username: res.data.username, firstName: res.data.firstName, surname: res.data.surname}))
    }

    async changePassword() {
        await axios.put('/api/dispatcher/updatePassword', {currentPassword: this.state.currentPassword, newPassword: this.state.newPassword, confirmNewPassword: this.state.confirmNewPassword})
            .then((res) => {
                swal.fire(
                    'Success',
                    'Password updated successfully!',
                    'success'
                )
            }).catch(error => {
                swal.fire({
                    title: 'Error',
                    text: error.response.data.msg,
                    icon: 'error'
                })
            })
    }

    render() {
        return (
            <div style={{margin: "0.5em"}}>
                <h1>Settings</h1>
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    this.changePassword()
                }} 
                style={{width: "50%", marginTop: "2em"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={this.state.username} disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={this.state.firstName} disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control type="text" value={this.state.surname} disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => this.setState({currentPassword: e.target.value})} placeholder="Current Password" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => this.setState({newPassword: e.target.value})} placeholder="New Password" required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => this.setState({confirmNewPassword: e.target.value})} placeholder="Confirm Password" required/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </Form>
            </div>
        )
    }
}