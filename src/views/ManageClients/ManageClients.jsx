import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const ManageClients = () => {
    const apiUrl = config.BASE_URL;

    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Current page state
    const [itemsPerPage] = useState(5);  // Items per page state, you can change this to any number

    const navigate = useNavigate();

    const toggleActiveStatus = (clientId) => {

        setClients((prevClients) =>
            prevClients.map((client) =>
                client.id === clientId ? { ...client, isActive: !client.isActive } : client
            )
        );
    };

    // Add Client
    const handleAddClient = () => {
        navigate('/addClient');
    };

    // Edit client
    const handleEditClient = (clientId) => {
        // alert(`Edit client with ID: ${clientId}`);
        navigate(`/editClient/${clientId}`);
    };

    // on change calling function for searching
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter clients with Searching
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Logic for pagination: Get current page clients
    const indexOfLastClient = currentPage * itemsPerPage;
    const indexOfFirstClient = indexOfLastClient - itemsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fetch clients data from post api (Important)
    useEffect(() => {
        const fetchData = async () => {
            const requestData = {
                allRecords: true
            };
            try {
                const response = await axios.post(`${apiUrl}/Client/List`, requestData);

                // Check if response was successful (status 200)
                if (response.status === 200) {
                    console.log('Client data:', response.data.records);
                    setClients(response.data.records);
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
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

    return (
        <>
            <h2 className="display-4 mb-3">Manage Clients</h2>
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
                        <button className="btn btn-primary" onClick={handleAddClient}>
                            Add Client
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Primary Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClients.length > 0 ? (
                            currentClients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.primaryContact}</td>
                                    <td>
                                        <button
                                            className="btn btn-info me-5"
                                            onClick={() => handleEditClient(client.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn ${client.isActive ? 'btn-success' : 'btn-warning'}`}
                                            onClick={() => toggleActiveStatus(client.id)}
                                        >
                                            {client.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No clients found</td>
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
        </>
    );
};

export default ManageClients;
