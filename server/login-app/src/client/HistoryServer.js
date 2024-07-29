import React, { Fragment, useEffect, useState ,useCallback} from "react";
import { formatDate } from '../utils/Const';
import { useToken } from '../utils/Const';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import '../ListServer.css'; 
import { jwtDecode } from 'jwt-decode';
import useAxios from "../utils/axios";

const HistoryServer = () => {
    const [history, setHistory] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const token = useToken();
    const userRole = token ? jwtDecode(token).role : null;
    const username = token ? jwtDecode(token).username : null;
    const axiosInstance = useAxios();

    const getHistory = useCallback(async () => {
        try {
            const response = await axiosInstance("/history/servers");
            setHistory(response.data);
        } catch (error) {
            console.error(error.message);
        }
    }, [axiosInstance]);

    useEffect(() => {
            getHistory();

    }, [getHistory]);

    const deleteServer = async (id) => { 
        try {
            await axiosInstance.delete(`/history/${id}`);
            setHistory(history.filter(record => record.id !== id));
        } catch (error) {
            console.error(error.message);
        }
    };

    const updateHistory = async (e) => {
        e.preventDefault();
        try {
            const { id, server_name, reason_for_failure, date_of_failure, date_of_startup, status } = editingRecord;
            const body = {
                server_name, reason_for_failure, date_of_failure, date_of_startup, status, username 
            }
            await axiosInstance.put(`/history/${id}`,
                body,
            );
            setEditingRecord(null);
            getHistory(); 
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleEditClick = (record) => {
        setEditingRecord(record);
    };

    return (
        <Fragment>
            <div className="table-container mb-5 mt-3">
                <h3>History</h3>
                <Table striped bordered hover responsive className="mt-3 text-center">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Server Name</th>
                            <th>Reason for Failure</th>
                            <th>Date of Failure</th>
                            <th>Date of Startup</th>
                            <th>Status</th>
                            <th>Change Timestamp</th> 
                            {userRole === 'admin' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(record => (
                            <tr key={record.id}>
                                <td>{record.username}</td>
                                <td data-label="Server Name">{record.server_name}</td>
                                <td data-label="Reason for Failure">{record.reason_for_failure}</td>
                                <td data-label="Date of Failure">{formatDate(record.date_of_failure)}</td>
                                <td data-label="Date of Startup">{formatDate(record.date_of_startup)}</td>
                                <td data-label="Status">{record.status}</td>
                                <td data-label="Change Timestamp">{formatDate(record.change_timestamp)}</td>
                                {userRole === 'admin' && (
                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                        <Button variant="warning" onClick={() => handleEditClick(record) }  className="me-2">
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => deleteServer(record.id)}>
                                            Delete
                                        </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
    
            {editingRecord && (
                <Modal show onHide={() => setEditingRecord(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit History Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={updateHistory}>
                            <Form.Group>
                                <Form.Label>Reason for Failure</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingRecord.reason_for_failure}
                                    onChange={e => setEditingRecord({ ...editingRecord, reason_for_failure: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date of Failure</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formatDate(editingRecord.date_of_failure)}
                                    onChange={e => setEditingRecord({ ...editingRecord, date_of_failure: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date of Startup</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formatDate(editingRecord.date_of_startup)}
                                    onChange={e => setEditingRecord({ ...editingRecord, date_of_startup: e.target.value })}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary">Update</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setEditingRecord(null)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    );
};

export default HistoryServer;
