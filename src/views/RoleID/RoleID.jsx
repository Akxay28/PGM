import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const RoleID = () => {
    const apiUrl = config.BASE_URL;
    // const { id } = useParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [RoleId, setRoleId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Current page state
    const [itemsPerPage] = useState(5);  // Items per page state
    const [isDialogOpen, setDialogOpen] = useState(false);  // State for dialog
    const [id, setid] = useState(null); // State to store RoleIdId for status change

    const navigate = useNavigate();

    // Function to open the confirmation dialog
    const openDialog = (roleId) => {
        setid(roleId);
        setDialogOpen(true);
    };

    // Function to close the confirmation dialog
    const closeDialog = () => {
        setDialogOpen(false);
        setid(null);
    };

    // Function to toggle client active status (activate/deactivate)
    const toggleActiveStatus = async () => {
        if (id) {
            console.log(id, 'id');

            try {
                const response = await axios.post(
                    `https://pgmapi.outrightsoftware.com/api/Role/Insert`,
                    { id: id },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
                console.log(response.data, 'response.data on submit');

                // Update RoleId list after toggling status
                setRoleId((prevClients) =>
                    prevClients.map((role) =>
                        role.id === id
                            ? { ...role, isActive: !role.isActive }
                            : role
                    )
                );
                toast.success("Client status updated successfully!");
                closeDialog(); // Close dialog after successful action
            } catch (error) {
                console.error('Error changing client status:', error);
            }
        }
    };

    // Add Client
    const handleRoleId = () => {
        navigate('/addClient');
    };

    // Edit client
    const handleEditRoleId = (RoleID) => {
        navigate(`/editClient/${RoleID}`);
    };

    // on change calling function for searching
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter clients with Searching
    const filteredRoleId = RoleId.filter(roleId =>
        roleId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleId.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Logic for pagination: Get current page clients
    const indexOfLastRoleId = currentPage * itemsPerPage;
    const indexOfFirstRoleId = indexOfLastRoleId - itemsPerPage;
    const currentRoleId = filteredRoleId.slice(indexOfFirstRoleId, indexOfLastRoleId);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fetch clients data from post api
    useEffect(() => {
        const fetchData = async () => {
            const requestData = { allRecords: true };
            try {
                const response = await axios.post(`${apiUrl}/Role/List`, requestData);
                console.log(response.data.records, 'response');

                if (response.status === 200) {
                    setRoleId(response.data.records);
                } else {
                    console.log('Request failed with status:', response.status);
                }
            } catch (err) {
                console.error('Error fetching client data:', err.response ? err.response.data : err.message);
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Empty dependency array ensures this runs once when the component mounts

    // Calculate total pages
    const totalPages = Math.ceil(filteredRoleId.length / itemsPerPage);

    return (
        <>
            <div><Toaster /></div>
            <h2 className="display-4 mb-3">Role ID</h2>
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Clients"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleRoleId}>
                            Add Role
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRoleId.length > 0 ? (
                            currentRoleId.map(RoleId => (
                                <tr key={RoleId.id}>
                                    <td>{RoleId.id}</td>
                                    <td>{RoleId.name}</td>
                                    <td>{RoleId.description}</td>
                                    <td>{RoleId.createdDate}</td>
                                    <td>
                                        <button
                                            className="btn btn-info me-5"
                                            onClick={() => handleEditRoleId(RoleId.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn ${RoleId.isActive ? 'btn-success' : 'btn-warning'}`}
                                            onClick={() => openDialog(RoleId.id)}
                                        >
                                            {RoleId.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No RoleIds found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`btn btn-secondary me-2 ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="btn btn-secondary"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Custom Confirmation Dialog */}
            {isDialogOpen && (
                <div className="confirm-dialog">
                    <div className="confirm-content">
                        <p>Are you sure you want to change the status of this RoleId?</p>
                        <button className="confirm-btn" onClick={toggleActiveStatus}>
                            Yes
                        </button>
                        <button className="confirm-btn" onClick={closeDialog}>
                            No
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoleID;
