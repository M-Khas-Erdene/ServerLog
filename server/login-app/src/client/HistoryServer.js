import React, { Fragment, useEffect, useState ,useCallback} from "react";
import { formatDate } from '../utils/Const';
import { useToken } from '../utils/Const';
import { Table } from 'react-bootstrap';
import '../ListServer.css'; 

const HistoryServer = () => {
    const [history, setHistory] = useState([]);
    const token = useToken();

    const getHistory = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/history/servers", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const jsonData = await response.json();
            setHistory(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    },[token]);

    useEffect(() => {
        if (token) {
            getHistory();
        }
    }, [token, getHistory]);

    return (
        <Fragment>
            <div className="table-container mb-5 mt-3">
                <h3>History</h3>
                <Table striped bordered hover responsive className="mt-3 text-center">
                    <thead>
                        <tr>
                            <th >Server Name</th>
                            <th >Reason for Failure</th>
                            <th >Date of Failure</th>
                            <th >Date of Startup</th>
                            <th >Status</th>
                            <th >Change Timestamp</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(record => (
                            <tr key={record.id}>
                                <td data-label="Server Name">{record.server_name}</td>
                                <td data-label="Reason for Failure">{record.reason_for_failure}</td>
                                <td data-label="Date of Failure">{formatDate(record.date_of_failure)}</td>
                                <td data-label="Date of Startup">{formatDate(record.date_of_startup)}</td>
                                <td data-label="Status">{record.status}</td>
                                <td data-label="Change Timestamp">{formatDate(record.change_timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Fragment>
    );
}

export default HistoryServer;
