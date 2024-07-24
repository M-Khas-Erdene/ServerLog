import React, { Fragment, useState, useEffect  } from "react";
import { validate,useToken  } from '../utils/Const';

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
    const token = useToken();
    const [errors, setErrors] = useState({});
    const validationErrors = validate(server_name, location, internal_address, external_address, status);

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

            const response = await fetch("http://localhost:5000/add", {
                method: "POST",
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
            <h1 className="text-center mt-5">Input Server</h1>
            <div className="form-container">
                <form className="d-flex flex-column mt-5" onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control ${errors.server_name ? 'is-invalid' : ''}`}
                            value={server_name}
                            onChange={e => setServerName(e.target.value)}
                            placeholder="Enter server name"
                        />
                        {errors.server_name && <div className="invalid-feedback">{errors.server_name}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control mt-3 ${errors.location ? 'is-invalid' : ''}`}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Enter location"
                        />
                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control mt-3 ${errors.system_running ? 'is-invalid' : ''}`}
                            value={system_running}
                            onChange={e => setSystemRunning(e.target.value)}
                            placeholder="Enter system running"
                        />
                        {errors.system_running && <div className="invalid-feedback">{errors.system_running}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control mt-3 ${errors.internal_address ? 'is-invalid' : ''}`}
                            value={internal_address}
                            onChange={e => setInternalAddress(e.target.value)}
                            placeholder="Enter internal address"
                        />
                        {errors.internal_address && <div className="invalid-feedback">{errors.internal_address}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control mt-3 ${errors.external_address ? 'is-invalid' : ''}`}
                            value={external_address}
                            onChange={e => setExternalAddress(e.target.value)}
                            placeholder="Enter external address"
                        />
                        {errors.external_address && <div className="invalid-feedback">{errors.external_address}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control mt-3"
                            value={reason_for_failure}
                            onChange={e => setReasonForFailure(e.target.value)}
                            placeholder="Enter reason for failure"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="datetime-local"
                            className="form-control mt-3"
                            value={date_of_failure}
                            onChange={e => setDateOfFailure(e.target.value || null)}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="datetime-local"
                            className="form-control mt-3"
                            value={date_of_startup}
                            onChange={e => setDateOfStartup(e.target.value || null)}
                        />
                    </div>

                    <div className="d-flex mt-3 mb-3">
                        <div>
                            <input
                                type="radio"
                                id="active"
                                name="status"
                                value="active"
                                checked={status === "active"}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <label htmlFor="active" className="ml-1">Active</label>
                        </div>
                        <div className="ml-5">
                            <input
                                type="radio"
                                id="inactive"
                                name="status"
                                value="inactive"
                                checked={status === "inactive"}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <label htmlFor="inactive" className="ml-1">Inactive</label>
                        </div>
                        {errors.status && <div className="ml-5 text-danger">{errors.status}</div>}
                    </div>
                    
                    <button className="btn btn-success">Add</button>
                    
                </form>
                
                {errors.form && <div className="form-error">{errors.form}</div>}
                
            </div>
            
        </Fragment>
        
    );


};

export default InputServer;
