import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const Billing = () => {
    const apiUrl = config.BASE_URL;

    const [searchQuery, setSearchQuery] = useState('');
    const [billing, setBilling] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Current page state
    const [itemsPerPage] = useState(5);  // Items per page state
    const [isDialogOpen, setDialogOpen] = useState(false);  // State for dialog
    const [id, setid] = useState(null); // State to store RoleIdId for status change

    const navigate = useNavigate();

    // Function to open the confirmation dialog
    const openDialog = (billingId) => {
        setid(billingId);
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
                // Get the token from localStorage
                const getLocalData = JSON.parse(localStorage.getItem('token'));
                const token = getLocalData.token;

                // Using the correct API endpoint for changing status
                const response = await axios.post(
                    `${apiUrl}/BillingProfile/ChangeStatus`,
                    { id: id },  // Send the ID in the request body
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                console.log(response, 'response.data on submit');

                // Update billing list after toggling status
                setBilling((prevBilling) =>
                    prevBilling.map((item) =>
                        item.id === id
                            ? { ...item, isActive: !item.isActive }
                            : item
                    )
                );
                toast.success("Billing status updated successfully!");
                closeDialog(); // Close dialog after successful action
            } catch (error) {
                console.error('Error changing Billing status:', error);
                toast.error("Failed to update Billing status!");
            }
        }
    };
    // Add Billing
    const handleBilling = () => {
        navigate('/addBilling');
    };

    // Edit Billing
    const handleEditBilling = (BillingId) => {
        // alert('IN progress he bhai badme ana');
        navigate(`/editBilling/${BillingId}`);
    };

    // on change calling function for searching
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter billings with Searching - improved to handle null/undefined values
    const filteredBilling = billing.filter(item => {
        const nameMatch = item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const gstMatch = item.gstNumber && item.gstNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || gstMatch;
    });

    // Logic for pagination: Get current page items
    const indexOfLastBilling = currentPage * itemsPerPage;
    const indexOfFirstBilling = indexOfLastBilling - itemsPerPage;
    const currentBilling = filteredBilling.slice(indexOfFirstBilling, indexOfLastBilling);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fetch billing data from post api
    useEffect(() => {
        const fetchData = async () => {
            const requestData = { allRecords: true };

            // Extract the token from local storage
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;
            try {
                const response = await axios.post(`${apiUrl}/BillingProfile/List`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                // console.log(response.data.records, 'response in listing');

                // Set the billing data to state
                if (response.status === 200) {
                    if (response.data.records && Array.isArray(response.data.records)) {
                        setBilling(response.data.records);
                    } else if (Array.isArray(response.data)) {
                        setBilling(response.data);
                    } else {
                        console.error("Unexpected API response structure", response.data);
                        setBilling([]);
                    }
                } else {
                    console.log('Request failed with status:', response.status);
                }
            } catch (err) {
                console.error('Error fetching Billing data:', err.response ? err.response.data : err.message);
                toast.error("Failed to load billing data!");
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Empty dependency array ensures this runs once when the component mounts



    // Calculate total pages
    const totalPages = Math.ceil(filteredBilling.length / itemsPerPage);

    return (
        <>
            <div><Toaster /></div>
            <h2 className="display-4 mb-3">Billing</h2>
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Name or GST Number"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleBilling}>
                            Add Billing
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>GST Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBilling.length > 0 ? (
                            currentBilling.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.gstNumber}</td>
                                    <td>
                                        <button
                                            className="btn btn-info me-2"
                                            onClick={() => handleEditBilling(item.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn ${item.isActive ? 'btn-success' : 'btn-warning'}`}
                                            onClick={() => openDialog(item.id)}
                                        >
                                            {item.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No Billings found</td>
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
                        <p>Are you sure you want to change the status of this billing profile?</p>
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

export default Billing;