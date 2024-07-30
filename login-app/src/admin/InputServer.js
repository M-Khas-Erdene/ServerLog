import React, { Fragment, useState } from "react";
import { validate, useToken } from '../utils/Const';
import { Modal, Button, Form, Row, Col,Container } from 'react-bootstrap';
import useAxios from "../utils/axios";

const InputServer = () => {
    const [server_name, setServerName] = useState("");
    const [location, setLocation] = useState("");
    const [system_running, setSystemRunning] = useState("");
    const [internal_address, setInternalAddress] = useState("");
    const [external_address, setExternalAddress] = useState("");
    const [reason_for_failure, setReasonForFailure] = useState("");
    const [date_of_failure, setDateOfFailure] = useState(null);
    const [date_of_startup, setDateOfStartup] = useState(null);
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const token = useToken();

    const validationErrors = validate(server_name, location, internal_address, external_address, status);
    const axiosInstance = useAxios();
    const onSubmitForm = async e => {
        e.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            if (!token) {
                throw new Error('Token not found');
            }
            const body = {
                server_name,
                location,
                system_running,
                internal_address,
                external_address,
                reason_for_failure,
                ...(date_of_failure && { date_of_failure }),
                ...(date_of_startup && { date_of_startup }),
                status
            };

            const response = await axiosInstance.post("/add",body);
            if (response.status !== 200) {
                throw new Error("Something went wrong");
            }

            window.location.reload();
        } catch (err) {
            setErrors({ form: err.message });
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; 
    };
    const handleClient = () => {
        window.location.href = '/'; 
    };

    return (
        <Fragment>
            <Container className="d-flex justify-content-between mt-5">
                <Button variant="warning" onClick={() => setShowModal(true)}>
                    + Add New Server
                </Button>
                <div>
                <Button variant="primary" onClick={handleClient} className="ml-2">
                        Client page
                    </Button>
                    <Button variant="danger" onClick={handleLogout} className="ml-2">
                        Log out
                    </Button>
                </div>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Server</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding:"20px"}}>
                    <Form onSubmit={onSubmitForm}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Server Name</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={server_name}
                                    onChange={e => setServerName(e.target.value)}
                                    isInvalid={!!errors.server_name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.server_name}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Location</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    isInvalid={!!errors.location}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.location}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">System Running</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={system_running}
                                    onChange={e => setSystemRunning(e.target.value)}
                                    isInvalid={!!errors.system_running}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.system_running}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Internal Address</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={internal_address}
                                    onChange={e => setInternalAddress(e.target.value)}
                                    isInvalid={!!errors.internal_address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.internal_address}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">External Address</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={external_address}
                                    onChange={e => setExternalAddress(e.target.value)}
                                    isInvalid={!!errors.external_address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.external_address}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Reason for Failure</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    value={reason_for_failure}
                                    onChange={e => setReasonForFailure(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Date of Failure</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="datetime-local"
                                    value={date_of_failure}
                                    onChange={e => setDateOfFailure(e.target.value || null)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Date of Startup</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="datetime-local"
                                    value={date_of_startup}
                                    onChange={e => setDateOfStartup(e.target.value || null)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Status</Form.Label>
                            <Col sm="8">
                                <div className="mt-2">
                                    <Form.Check 
                                        inline
                                        type="radio"
                                        label="Active"
                                        id="Active"
                                        name="status"
                                        value="Active"
                                        checked={status === "Active"}
                                        onChange={e => setStatus(e.target.value)}
                                    />
                                    <Form.Check
                                    style={{paddingLeft:'10px'}}
                                        inline
                                        type="radio"
                                        label="Inactive"
                                        id="Inactive"
                                        name="status"
                                        value="Inactive"
                                        checked={status === "Inactive"}
                                        onChange={e => setStatus(e.target.value)}
                                    />
                                </div>
                                {errors.status && <div className="text-danger">{errors.status}</div>}
                            </Col>
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-4">
                            Add
                        </Button>
                    </Form>
                    {errors.form && <div className="form-error text-danger mt-3">{errors.form}</div>}
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default InputServer;
