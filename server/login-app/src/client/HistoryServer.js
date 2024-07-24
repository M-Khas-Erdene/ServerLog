import React, { Fragment, useEffect, useState } from "react";
import { formatDate } from '../utils/Const';
import { useToken } from '../utils/Const';
const HistoryServer = () => {
    const [history, setHistory] = useState([]);
    const token = useToken();
    const getHistory = async() => {
        try {
            
            const response = await fetch ("http://localhost:5000/history/servers",{
                headers: {
                  'Authorization': `Bearer ${token}`, 
                }
            });
            const jsonData = await response.json();
            setHistory(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };


      useEffect(() => {
        if (token) {
            getHistory();
        }
    }, [token]);


    return (
        <Fragment>
            {" "}
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Server Name</th>
                        <th>Reason for Failure</th>
                        <th>Date of Failure</th>
                        <th>Date of Startup</th>
                        <th>Status</th>
                        <th>Change Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(record => (
                        <tr key={record.id}>
                            <td>{record.server_name}</td>
                            <td>{record.reason_for_failure}</td>
                            <td>{formatDate(record.date_of_failure)}</td>
                            <td>{formatDate(record.date_of_startup)}</td>
                            <td>{record.status}</td>
                            <td>{formatDate(record.change_timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default HistoryServer;
