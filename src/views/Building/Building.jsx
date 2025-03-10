import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const Building = () => {
    const apiUrl = config.BASE_URL;
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [buildings, setBuildings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [buildingIdToChange, setBuildingIdToChange] = useState(null);
    const navigate = useNavigate();

    // Fetch buildings data
    const fetchBuildings = async () => {
        // Extract the token from local storage
        const getLocalData = JSON.parse(localStorage.getItem('token'));
        const token = getLocalData.token;

        const requestData = { allRecords: true };
        try {
            const response = await axios.post(`${apiUrl}/Building/List`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Full API Response:", response.data);
            if (response.status === 200 && response.data.records) {
                console.log("Full API Response.data.records:", response.data.records);
                setBuildings(response.data.records);
            } else {
                console.log('Unexpected response format:', response.data);
            }
        } catch (err) {
            console.error('Error fetching building data:', err.response ? err.response.data : err.message);
            toast.error("Failed to fetch buildings");
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const closeDialog = () => {
        setDialogOpen(false);
        setBuildingIdToChange(null);
    };

    const toggleActiveStatus = async () => {
        if (buildingIdToChange) {
            try {
                const getLocalData = JSON.parse(localStorage.getItem('token'));
                const token = getLocalData.token;

                // await axios.post(
                //     `${apiUrl}/Building/ChangeStatus`,
                //     { BuildingId: buildingIdToChange },
                //     {
                //         headers: {
                //             'Authorization': `Bearer ${token}`,
                //             'Content-Type': 'application/json'
                //         }
                //     }
                // );

                // toast.success("Building status updated successfully!");
                closeDialog();
                fetchBuildings();
            } catch (error) {
                console.error('Error changing building status:', error);
                toast.error("Failed to update building status");
            }
        }
    };

    const handleAddBuilding = () => {
        navigate('/addBuilding');
    };

    const navigateToRooms = (buildingId) => {
        // navigate(`/building/${buildingId}/room`);
        navigate(`/room/${buildingId}`);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.trim().toLowerCase());
        setCurrentPage(1);
    };

    // Filtered buildings based on search query
    const filteredBuildings = buildings.filter(building =>
        building.name.toLowerCase().includes(searchQuery)
    );

    // Pagination Logic
    const indexOfLastBuilding = currentPage * itemsPerPage;
    const indexOfFirstBuilding = indexOfLastBuilding - itemsPerPage;
    const currentBuildings = filteredBuildings.slice(indexOfFirstBuilding, indexOfLastBuilding);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div><Toaster /></div>
            <h2 className="display-4 mb-3">Manage Buildings</h2>
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Building..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleAddBuilding}>
                            Add Building
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Billing Profile</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBuildings.length > 0 ? (
                            currentBuildings.map(building => (
                                <tr key={building.id}>
                                    <td>{building.name}</td>
                                    <td>{building.billingProfile.name || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn btn-secondary me-2"
                                            onClick={() => navigateToRooms(building.id)}
                                        >
                                            Rooms
                                        </button>
                                        <button
                                            className="btn btn-info me-2"
                                            onClick={
                                                // () => navigate(`/editBuilding/${building.id}`)
                                                () => alert("Kam chalu he badme ana")
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn ${building.isActive ? 'btn-danger' : 'btn-success'}`}
                                            onClick={() => {
                                                setBuildingIdToChange(building.id);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            {building.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No Buildings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {filteredBuildings.length > itemsPerPage && (
                    <div className="pagination">
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(filteredBuildings.length / itemsPerPage) }, (_, index) => (
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
                            disabled={currentPage === Math.ceil(filteredBuildings.length / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {isDialogOpen && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Change</h5>
                                <button type="button" className="btn-close" onClick={closeDialog}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change the status of this building?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDialog}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={toggleActiveStatus}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Building;