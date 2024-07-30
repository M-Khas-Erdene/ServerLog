import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import useAxios from '../utils/axios';
import Image from "../assets/image.png";
import Logo from "../assets/logo.jpg";
import '../login.css'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const axiosInstance = useAxios();
    const [ showPassword ] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', {
                loginData: {
                    username: username, 
                    password: password
                }
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            if (decodedToken.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/';
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
        <Container className="login-main d-flex justify-content-center align-items-center">
            <div className="login-left">
                <img src={Image} alt="Login Visual" />
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src={Logo} alt="Logo" />
                    </div>
                    <div className="login-center">
                        <h2>Welcome back!</h2>
                        <p>Please enter your details</p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <input  style={{padding:"16px"}}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <div className="pass-input-div">
                                <input style={{padding:"16px"}}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
          
                            <div className="login-center-buttons">
                                <button type="submit">Log In</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
  );
}

export default Login;
