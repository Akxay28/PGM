import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const Users = () => {
    const apiUrl = config.BASE_URL;

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userIdToChange, setUserIdToChange] = useState(null);

    const navigate = useNavigate();

    // Open Confirmation Dialog
    const openDialog = (userId) => {
        setUserIdToChange(userId);
        setDialogOpen(true);
    };

    // Close Confirmation Dialog
    const closeDialog = () => {
        setDialogOpen(false);
        setUserIdToChange(null);
    };

    // Add Client
    const handleAddClient = () => {
        navigate('/addUsers');
    };

    // Edit Client
    const handleEditClient = (userId) => {
        alert('Edit User ' + userId);
        // navigate(`/editUsers/${userId}`);
    };

    // Search Filter
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Reset to first page when searching
        setCurrentPage(1);
    };

    // Filter Users for Search - Fixed to handle null/undefined values safely
    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        const firstName = user.firstName?.toLowerCase() || '';
        const lastName = user.lastName?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const roleName = user.role?.name?.toLowerCase() || '';

        return firstName.includes(query) ||
            lastName.includes(query) ||
            email.includes(query) ||
            roleName.includes(query);
    });

    // Pagination
    const indexOfLastClient = currentPage * itemsPerPage;
    const indexOfFirstClient = indexOfLastClient - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstClient, indexOfLastClient);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fetch Users Data
    useEffect(() => {
        const fetchData = async () => {
            const requestData = { allRecords: true };
            try {
                const response = await axios.post(`${apiUrl}/User/List`, requestData);
                if (response.status === 200) {
                    setUsers(response.data.records);
                } else {
                    console.log('Request failed with status:', response.status);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                toast.error("Failed to load users.");
            }
        };

        fetchData();
    }, [apiUrl]);

    // Ensure at least 1 page exists
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

    return (
        <>
            <div><Toaster /></div>
            <h2 className="display-4 mb-3">Users</h2>
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name, email or role"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleAddClient}>
                            Add Users
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map(user => (
                                <tr key={user.id || user.userId || user.clientId || index}>
                                    <td>{user.firstName || '-'}</td>
                                    <td>{user.lastName || '-'}</td>
                                    <td>{user.email || '-'}</td>
                                    <td>{user.role?.name || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-info me-5"
                                            onClick={() => handleEditClient(user.id || user.userId || user.clientId)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No Users found</td>
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
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {isDialogOpen && (
                <div className="confirm-dialog">
                    <div className="confirm-content">
                        <p>Are you sure you want to change the status of this user?</p>
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

export default Users;