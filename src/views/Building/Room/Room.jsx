import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../../config';

const Room = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [roomIdToChange, setRoomIdToChange] = useState(null);
    const navigate = useNavigate();

    const apiUrl = config.BASE_URL;

    // Fetch rooms data
    const fetchRooms = async () => {
        const requestData = { allRecords: true };
        try {
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;

            const response = await axios.post(`${apiUrl}/Room/List`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.records, 'response.data for rooms');

            // Set the rooms state with the records from the API response
            setRooms(response.data.records || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error("Failed to fetch rooms");
        }
    };

    // Fetch buildings for filter dropdown and to get building names
    const fetchBuildings = async () => {
        try {
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;

            const response = await axios.post(`${apiUrl}/Building/List`, { allRecords: true }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data, 'response.data for buildings');

            // Assuming the building data is also in a 'records' property
            setBuildings(response.data.records || []);
        } catch (error) {
            console.error('Error fetching buildings:', error);
            toast.error("Failed to fetch buildings");
        }
    };

    // Fetch billing profiles
    const fetchBillingProfiles = async () => {
        try {
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;

            const response = await axios.post(`${apiUrl}/BillingProfile/List`, { allRecords: true }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(response.data, 'response.data for billing profiles');

            // Assuming the billing profile data is also in a 'records' property
            setBillingProfiles(response.data.records || []);
        } catch (error) {
            console.error('Error fetching billing profiles:', error);
            toast.error("Failed to fetch billing profiles");
        }
    };

    // Get building name by ID
    const getBuildingName = (buildingId) => {
        const building = buildings.find(b => b.id === buildingId);
        return building ? building.name : 'N/A';
    };

    // Get billing profile name by ID
    const getBillingProfileName = (profileId) => {
        const profile = billingProfiles.find(p => p.id === profileId);
        return profile ? profile.name : 'N/A';
    };

    // Get room type name
    const getRoomTypeName = (roomTypeId) => {
        const roomTypes = {
            0: 'Standard',
            1: 'Deluxe',
            2: 'Suite',
            3: 'Executive'
            // Add more room types as needed
        };
        return roomTypes[roomTypeId] || 'Unknown';
    };

    // Fetch data when component mounts and set the building filter if ID is provided
    useEffect(() => {
        fetchRooms();
        fetchBuildings();
        fetchBillingProfiles();

        // Set the selected building to the ID from the URL if it exists
        if (id) {
            setSelectedBuilding(id);
        }
    }, [id]);

    const closeDialog = () => {
        setDialogOpen(false);
        setRoomIdToChange(null);
    };

    const toggleActiveStatus = async () => {
        if (roomIdToChange) {
            try {
                const getLocalData = JSON.parse(localStorage.getItem('token'));
                const token = getLocalData.token;

                await axios.post(
                    `${apiUrl}/room/ChangeStatus`,
                    { RoomId: roomIdToChange },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                toast.success("Room status updated successfully!");
                closeDialog();
                fetchRooms();
            } catch (error) {
                console.error('Error changing room status:', error);
                toast.error("Failed to update room status");
            }
        }
    };

    // Handle status change (activate or deactivate)
    const handleStatusChange = async (roomId, currentStatus) => {
        try {
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;

            await axios.post(
                `${apiUrl}/room/ChangeStatus`,
                { RoomId: roomId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success(`Room ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
            fetchRooms();
        } catch (error) {
            console.error('Error changing room status:', error);
            toast.error("Failed to update room status");
        }
    };

    const handleAddRoom = () => {
        // Navigate to add room with building ID pre-selected if available
        if (selectedBuilding) {
            navigate(`/addRoom?buildingId=${selectedBuilding}`);
        } else {
            navigate('/addRoom');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.trim().toLowerCase());
        setCurrentPage(1);
    };

    const handleBuildingFilterChange = (e) => {
        setSelectedBuilding(e.target.value);
        setCurrentPage(1);
    };

    // Filter rooms based on search query and selected building
    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name?.toLowerCase().includes(searchQuery) || false;
        const matchesBuilding = selectedBuilding === '' || room.buildingId?.toString() === selectedBuilding;
        return matchesSearch && matchesBuilding;
    });

    // Pagination Logic
    const indexOfLastRoom = currentPage * itemsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - itemsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div><Toaster /></div>
            <h2 className="display-4 mb-3">Manage Rooms</h2>
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col">
                        <select
                            className="form-select"
                            value={selectedBuilding}
                            onChange={handleBuildingFilterChange}
                        >
                            <option value="">All Buildings</option>
                            {buildings.map(building => (
                                <option key={building.id} value={building.id}>
                                    {building.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={handleAddRoom}>
                            Add Room
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Room Name</th>
                            <th>Room Type</th>
                            <th>Building</th>
                            <th>Billing Profile</th>
                            <th>Max Occupancy</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRooms.length > 0 ? (
                            currentRooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.name}</td>
                                    <td>{getRoomTypeName(room.roomType)}</td>
                                    <td>{getBuildingName(room.buildingId)}</td>
                                    <td>{getBillingProfileName(room.billingProfileId)}</td>
                                    <td>{room.maxOccupancy || 'N/A'}</td>
                                    <td>
                                        <button className={`btn btn-success me-2`}> Bed</button>

                                        <button className="btn btn-info" onClick={() => navigate(`/editRoom/${room.id}`)}>Edit</button>
                                    </td>
                                    <td>
                                        <button>active</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No rooms found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {filteredRooms.length > itemsPerPage && (
                    <div className="pagination">
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(filteredRooms.length / itemsPerPage) }, (_, index) => (
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
                            disabled={currentPage === Math.ceil(filteredRooms.length / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog - kept for cases where you might want to use it */}
            {isDialogOpen && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Change</h5>
                                <button type="button" className="btn-close" onClick={closeDialog}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change the status of this room?</p>
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

export default Room;