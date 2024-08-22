import React, { Fragment, useState } from "react";
import { formatDate } from '../utils/Const';
import useAxios from "../utils/axios";
const EditServer = ({ server }) => {
    const [reason_for_failure, setReasonForFailure] = useState(server.reason_for_failure);
    const [date_of_failure, setDateOfFailure] = useState(formatDate(server.date_of_failure));
    const [date_of_startup, setDateOfStartup] = useState(formatDate(server.date_of_startup));
    const axiosInstance = useAxios();
    const updateServer = async e => {
        e.preventDefault();
        try {
            const body = {
                reason_for_failure,
                date_of_failure: date_of_failure || null,
                date_of_startup: date_of_startup || null,
            };
            const response = await axiosInstance.put(`/servers/date/${server.id}`, body);

            if (response.status !== 200) {
                throw new Error("Something went wrong");
            }

            window.location.reload();
        } catch (err) {
            throw new Error("Something went wrong");
        }
    };

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#id${server.id}`}>
                Change State
            </button>

            <div className="modal fade" id={`id${server.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content ">
                        <div className="modal-header">
        
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                        </div>


                        <div className="modal-body">
                            <form onSubmit={updateServer}>
                               
                                <div className="form-group">
                                    <h6>the day the server went down</h6>
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={date_of_failure}
                                        onChange={e => setDateOfFailure(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>the day the server was turned on</h6>
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={date_of_startup}
                                        onChange={e => setDateOfStartup(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <h6>Reason for failure</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        value={reason_for_failure}
                                        onChange={e => setReasonForFailure(e.target.value)}
                                        placeholder="Enter reason for failure"
                                    />
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
