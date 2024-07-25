import React, { Fragment, useEffect, useState, useCallback } from "react";
import EditServer from "./EditServer";

import { useToken } from '../utils/Const';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import serverIMG from '../assets/serverIMG.jpg'; 

import '../ListServer.css';

const ListServer = () => {
    const token = useToken();
    const [servers, setServers] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
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
    const cardStyle = (id) => ({
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hoveredCard === id ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hoveredCard === id ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
    });
    return (
        <Fragment>
            <Container className="d-flex justify-content-between">
                <h1 className="mt-5 text-center">ML SERVERS</h1>
                <Button variant="primary" onClick={handleLogout} className="ml-auto mt-5">
                    Log out
                </Button>
            </Container>
            <Container className="mt-5">
                <Row>
                    {servers.map(server => (
                        <Col key={server.id} xs={12} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="h-100 shadow-sm"                                 style={cardStyle(server.id)}
                                onMouseEnter={() => setHoveredCard(server.id)}
                                onMouseLeave={() => setHoveredCard(null)}>
                                <Card.Img variant="top" src={serverIMG} alt={`${server.server_name} image`} />
                                <Card.Body>
                                    <Card.Title>{server.server_name}</Card.Title>
                                    <Card.Text><strong>Location:</strong> {server.location}</Card.Text>
                                    <Card.Text><strong>System Running:</strong> {server.system_running}</Card.Text>
                                    <Card.Text><strong>Reason for Failure:</strong> {server.reason_for_failure}</Card.Text>
                                    <Card.Text><strong>Status:</strong> {server.status}</Card.Text>
                                    <EditServer server={server} />
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
