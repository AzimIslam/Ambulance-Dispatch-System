import React, {useState} from "react";
import { Card, Form, Button } from "react-bootstrap"


const icon = require('../assets/ambulance-icon.png')


export const SignInBox = props => {
    return (
        <Card className="shadow mx-auto text-left m-3 p-4" style={{ width: '25rem' }}>
            <div className ="h4 mb-4">
                <img src={icon} width="40" className="mr-2" />
                Ambulance Log in
            </div>
            <Form onSubmit={(e) => {
                e.preventDefault()
                props.login()
                }
            }>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Control onChange={(e) => props.setUsername(e.target.value) }type="text" placeholder="Username" required={true} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Control onChange={(e) => props.setPassword(e.target.value) } type="password" placeholder="Password" required={true} />
                </Form.Group>
                <Button 
                     variant="primary" type="submit" >
                    Log in
                </Button>
            </Form>
        </Card>
    )
}