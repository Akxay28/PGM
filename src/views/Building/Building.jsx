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
    useEffect(() => {
        const fetchBuildings = async () => {
            const requestData = { allRecords: true };
            try {
                const response = await axios.post(`${apiUrl}/Building/List`, requestData);
                console.log("Full API Response:", response.data);
                if (response.status === 200 && response.data.records) {
                    console.log("Full API Response.data.records:", response.data.records);

                    // setBuildings(response.data.records);
                } else {
                    console.log('Unexpected response format:', response.data);
                }
            } catch (err) {
                console.error('Error fetching building data:', err.response ? err.response.data : err.message);
            }
        };
        fetchBuildings();
    }, []);

    const closeDialog = () => {
        setDialogOpen(false);
        setBuildingIdToChange(null);
    };

    const toggleActiveStatus = async () => {
        if (buildingIdToChange) {
            try {
                await axios.post(
                    `${apiUrl}/Building/ChangeStatus`,
                    { BuildingId: buildingIdToChange },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                toast.success("Building status updated successfully!");
                closeDialog();
                fetchBuildings();
            } catch (error) {
                console.error('Error changing building status:', error);
            }
        }
    };

    const handleAddBuilding = () => {
        navigate('/addBuilding');
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
                                    <td>{building.billingProfile}</td>
                                    <td>
                                        <button
                                            className="btn btn-info me-3"
                                            onClick={() => navigate(`/editBuilding/${building.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn ${building.isActive ? 'btn-success' : 'btn-warning'}`}
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
        </>
    );
};

export default Building;
