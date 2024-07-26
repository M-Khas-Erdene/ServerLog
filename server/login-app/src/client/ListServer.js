import React, { Fragment, useEffect, useState, useCallback } from "react";
import EditServer from "./EditServer";
import { Link } from 'react-router-dom';
import { useToken } from '../utils/Const';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import serverIMG from '../assets/serverIMG.jpg'; 
import {jwtDecode} from 'jwt-decode';
import '../ListServer.css';

const ListServer = () => {
    const token = useToken();
    const userRole = token ? jwtDecode(token).role : null;
    const [servers, setServers] = useState([]);
    const getServer = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/servers", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const jsonData = await response.json();
            setServers(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            getServer();
        }
    }, [token, getServer]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Fragment>
            <Container className="d-flex justify-content-between">
                <div>
                    {userRole === 'admin' ? (
                        <Link to="/admin" style={{ textDecoration: 'underline' }}>
                            <Button variant="primary" className="ml-auto mt-5">
                                Go Admin Page
                            </Button>
                        </Link>
                    ) : (
                        <h1 className="mt-5 text-center">ML SERVERS</h1>
                    )}
                </div>
                <Button variant="danger" onClick={handleLogout} className="ml-auto mt-5">
                    Log out
                </Button>
            </Container>
            <Container className="mt-5">
                <Row>
                    {servers.map(server => (
                        <Col key={server.id} xs={12} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className={`h-100 shadow-sm ${server.status === 'Active' ? 'card-active' : 'card-inactive'}`}>
                                <Card.Img variant="top" src={serverIMG} alt={`${server.server_name} image`} />
                                <Card.Body>
                                    <Card.Title>{server.server_name}</Card.Title>
                                    <Card.Text>{server.location}</Card.Text>
                                    <Card.Text>{server.system_running}</Card.Text>
                                    <Card.Text>{server.reason_for_failure}</Card.Text>
                                    <Card.Text>{server.status}</Card.Text>
                                    <div className="text-center mt-3">
                                        <EditServer server={server} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Fragment>
    );
}

export default ListServer;
