import React, { Fragment, useEffect, useState,useCallback} from "react";
import EditServer from "./EditServer";
import { formatDate } from '../utils/Const';
import { useToken } from '../utils/Const';
import { Table, Button } from 'react-bootstrap';
import '../ListServer.css';

const ListServer = () => {
    const token = useToken();
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
    },[token]);

    useEffect(() => {
        if (token) {
            getServer();
        }
    }, [token, getServer]);

    const deleteServer = async id => {
        try {
            if (!token) {
                throw new Error('Token not found');
            }
            await fetch(`http://localhost:5000/servers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setServers(servers.filter(server => server.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <Table striped bordered hover responsive className="mt-5 mb-5 text-center"  >
                <thead>
                    <tr>
                        <th>Server Name</th>
                        <th>Location</th>
                        <th>System Running</th>
                        <th>Internal Address</th>
                        <th>External Address</th>
                        <th>Reason for Failure</th>
                        <th>Date of Failure</th>
                        <th>Date of Startup</th>
                        <th>Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map(server => (
                        <tr key={server.id}>
                            <td data-label="Server Name">{server.server_name}</td>
                            <td data-label="Location">{server.location}</td>
                            <td data-label="System Running">{server.system_running}</td>
                            <td data-label="Internal Address">{server.internal_address}</td>
                            <td data-label="External Address">{server.external_address}</td>
                            <td data-label="Reason for Failure">{server.reason_for_failure}</td>
                            <td data-label="Date of Failure">{formatDate(server.date_of_failure)}</td>
                            <td data-label="Date of Startup">{formatDate(server.date_of_startup)}</td>
                            <td data-label="Status">{server.status}</td>
                            <td data-label="Edit"><EditServer server={server} /></td>
                            <td data-label="Delete">
                                <Button
                                    variant="danger"
                                    onClick={() => deleteServer(server.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Fragment>
    );
}

export default ListServer;
