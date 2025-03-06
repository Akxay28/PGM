import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageClients = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate()

    const [clients, setClients] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', primaryContact: '1234567890', isActive: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', primaryContact: '0987654321', isActive: false },
    ]);

    const toggleActiveStatus = (clientId) => {
        setClients((prevClients) =>
            prevClients.map((client) =>
                client.id === clientId ? { ...client, isActive: !client.isActive } : client
            )
        );
    };

    // Add Client
    const handleAddClient = () => {
        navigate('/addClient')
    };

    // Edit client
    const handleEditClient = (clientId) => {
        alert(`Edit client with ID: ${clientId}`);
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

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await axios.get('https://pgmapi.outrightsoftware.com/api/Client/List');
                console.log(response.data);
            } catch (err) {
                console.log('Error fetching client data');
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Empty dependency array ensures this runs once when the component mounts

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
                        {filteredClients.length > 0 ? (
                            filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.primaryContact}</td>
                                    <td>
                                        <button
                                            className="btn btn-info mr-2"
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
            </div>
        </>
    );
};

export default ManageClients;
