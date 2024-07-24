import React, { Fragment, useState } from "react";
import { formatDate,validate,useToken  } from '../utils/Const';

const EditServer = ({ server }) => {

    const [server_name, setServerName] = useState(server.server_name);
    const [location, setLocation] = useState(server.location);
    const [system_running, setSystemRunning] = useState(server.system_running);
    const [internal_address, setInternalAddress] = useState(server.internal_address);
    const [external_address, setExternalAddress] = useState(server.external_address);
    const [reason_for_failure, setReasonForFailure] = useState(server.reason_for_failure);
    const [date_of_failure, setDateOfFailure] = useState(formatDate(server.date_of_failure));
    const [date_of_startup, setDateOfStartup] = useState(formatDate(server.date_of_startup));
    const [status, setStatus] = useState(server.status || "");
    const token = useToken();
    const [errors, setErrors] = useState({});



    const updateServer = async e => {
        e.preventDefault();
        const validationErrors = validate(server_name, location, internal_address, external_address, status);
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
                date_of_failure: date_of_failure || null,
                date_of_startup: date_of_startup || null,
                status
            };
            const response = await fetch(`http://localhost:5000/servers/${server.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            window.location.reload();
        } catch (err) {
            setErrors({ form: err.message });
        }
    };

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#id${server.id}`}>
                Edit
            </button>

            <div className="modal" id={`id${server.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Server</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={updateServer}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.server_name ? 'is-invalid' : ''}`}
                                        value={server_name}
                                        onChange={e => setServerName(e.target.value)}
                                        placeholder="Enter server name"
                                    />
                                    {errors.server_name && <div className="invalid-feedback">{errors.server_name}</div>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.location ? 'is-invalid' : ''}`}
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        placeholder="Enter location"
                                    />
                                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.system_running ? 'is-invalid' : ''}`}
                                        value={system_running}
                                        onChange={e => setSystemRunning(e.target.value)}
                                        placeholder="Enter system running"
                                    />
                                    {errors.system_running && <div className="invalid-feedback">{errors.system_running}</div>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.internal_address ? 'is-invalid' : ''}`}
                                        value={internal_address}
                                        onChange={e => setInternalAddress(e.target.value)}
                                        placeholder="Enter internal address"
                                    />
                                    {errors.internal_address && <div className="invalid-feedback">{errors.internal_address}</div>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.external_address ? 'is-invalid' : ''}`}
                                        value={external_address}
                                        onChange={e => setExternalAddress(e.target.value)}
                                        placeholder="Enter external address"
                                    />
                                    {errors.external_address && <div className="invalid-feedback">{errors.external_address}</div>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        value={reason_for_failure}
                                        onChange={e => setReasonForFailure(e.target.value)}
                                        placeholder="Enter reason for failure"
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={date_of_failure}
                                        onChange={e => setDateOfFailure(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={date_of_startup}
                                        onChange={e => setDateOfStartup(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <div>
                                        <input
                                            type="radio"
                                            id={`active${server.id}`}
                                            name="status"
                                            value="active"
                                            checked={status === "active"}
                                            onChange={e => setStatus(e.target.value)}
                                        />
                                        <label htmlFor={`active${server.id}`} className="ml-1">Active</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id={`inactive${server.id}`}
                                            name="status"
                                            value="inactive"
                                            checked={status === "inactive"}
                                            onChange={e => setStatus(e.target.value)}
                                        />
                                        <label htmlFor={`inactive${server.id}`} className="ml-1">Inactive</label>
                                    </div>
                                    {errors.status && <div className="text-danger">{errors.status}</div>}
                                </div>

                                <button type="submit" className="btn btn-warning">Update</button>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditServer;
