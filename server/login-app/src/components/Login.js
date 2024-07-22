import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                loginData: {
                    username: username, 
                    password: password
                }
            });
            localStorage.setItem('token', response.data.token);
            const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
            if (decodedToken.role === 'admin') {
                window.location.href = 'http://localhost:3000/';
            } else {
                window.location.href = 'http://localhost:3001/';
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Username or password is incorrect');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter username" 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            required 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-4 w-100">
                        Login
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
