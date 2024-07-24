import React, { Fragment, useEffect, useState } from "react";
import EditServer from "./EditServer";
import { formatDate } from '../utils/Const';
import { useToken } from '../utils/Const';
const ListServer = () =>{
    const token = useToken();
    const [servers, setServers] = useState([]);
    const getServer = async()=> {
        try {
            const response = await fetch ("http://localhost:5000/servers",{
              headers: {
                'Authorization': `Bearer ${token}`, 
            }
            })
            const jsonData = await response.json()
            setServers(jsonData)
        } catch (error) {
            console.error(error.message);
        }
    }

      useEffect(() => {
        if (token) {
            getServer();
        }
    }, [token]);


    const deleteServer = async id => {
        try {
            if (!token) {
                throw new Error('Token not found');
            }
            await fetch(`http://localhost:5000/servers/${id}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token}` }
            });
            setServers(servers.filter(server => server.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    };

    return <Fragment>
        {" "}
        <table class="table mt-5 text-center">
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
                        <td>{server.server_name}</td>
                        <td>{server.location}</td>
                        <td>{server.system_running}</td>
                        <td>{server.internal_address}</td>
                        <td>{server.external_address}</td>
                        <td>{server.reason_for_failure}</td>
                        <td>{formatDate(server.date_of_failure)}</td>
                        <td>{formatDate(server.date_of_startup)}</td>
                        <td>{server.status}</td>
                        <td><EditServer server={server} /></td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={() => deleteServer(server.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
      ))}
 
    </tbody>
  </table>
    </Fragment>;

}


export default ListServer;