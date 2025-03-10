import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import config from '../../../config';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const EditRoom = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const apiUrl = config.BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams(); // Get the room ID from the URL params
    const [buildings, setBuildings] = useState([]);
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Extract the token from local storage
            const getLocalData = JSON.parse(localStorage.getItem('token'));
            const token = getLocalData.token;

            const requestData = { allRecords: true };
            try {
                // Fetch buildings
                const buildingsResponse = await axios.post(`${apiUrl}/Building/List`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (buildingsResponse.status === 200 && buildingsResponse.data.records) {
                    setBuildings(buildingsResponse.data.records);
                }

                // Fetch billing profiles
                const billingResponse = await axios.post(`${apiUrl}/BillingProfile/List`, requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (billingResponse.status === 200 && billingResponse.data.records) {
                    // Filter billing profiles to only include active ones
                    const allProfiles = billingResponse.data.records;
                    const activeProfiles = allProfiles.filter(profile => profile.isActive === true);

                    setBillingProfiles(activeProfiles);
                }

                // Fetch the room details
                const roomResponse = await axios.get(`${apiUrl}/Room/GetById/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Room response:', roomResponse.data);

                if (roomResponse.status === 200 && roomResponse.data && roomResponse.data.records) {
                    const roomData = roomResponse.data.records[0];
                    // Prepopulate form fields with room data
                    setValue("name", roomData.name || '');

                    // Add null checks for these potentially undefined values
                    setValue("roomType", roomData.roomType !== undefined ? roomData.roomType.toString() : '');
                    setValue("maxOccupancy", roomData.maxOccupancy || '');
                    setValue("buildingId", roomData.buildingId !== undefined ? roomData.buildingId.toString() : '');
                    setValue("billingProfileId", roomData.billingProfileId ? roomData.billingProfileId.toString() : '');
                    setValue("remarks", roomData.remarks || '');
                } else {
                    toast.error(`Room not found with ID: ${id}`);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err.response ? err.response.data : err.message);

                // Additional debug logs for toString errors
                if (err.message && err.message.includes("toString")) {
                    console.error('toString error on data:', err);
                }

                // Display specific error message if available
                if (err.response && err.response.status === 404) {
                    toast.error(`Room with ID ${id} not found.`);
                } else {
                    toast.error("Failed to fetch data");
                }

                setLoading(false);
            }
        };

        fetchData();
    }, [id, apiUrl, setValue]);

    const onSubmit = async (data) => {
        const getLocalData = JSON.parse(localStorage.getItem('token'));
        const token = getLocalData.token;
        const clientId = getLocalData.clientId;

        const { name, roomType, maxOccupancy, buildingId, billingProfileId, remarks } = data;

        const requestData = {
            id: id,  // Include the ID in the request body, not in the URL
            name,
            roomType: parseInt(roomType, 10) || 0,
            maxOccupancy: Number(maxOccupancy),
            buildingId: Number(buildingId),
            billingProfileId: billingProfileId ? Number(billingProfileId) : null,
            remarks,
            clientId: Number(clientId),
            isActive: true
        };

        try {
            // Fixed endpoint - remove ID from URL path
            const response = await axios.put(`${apiUrl}/Room/Update`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Update response:', response.data);
            toast.success("Room updated successfully!");
            setTimeout(() => {
                navigate('/building');
            }, 1500);
        } catch (error) {
            console.error('Error during submission:', error.response ? error.response.data : error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                toast.error(errorMessages.join(', '));
            } else {
                toast.error("Error updating room information");
            }
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Edit Room</h1>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name *</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control border border-dark"
                                required
                                {...register('name', { required: true })}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="roomType" className="form-label">Room Type *</label>
                            <select
                                id="roomType"
                                className="form-control border border-dark"
                                required
                                {...register('roomType', { required: true })}
                            >
                                <option value="">Select Room Type</option>
                                <option value="0">Standard</option>
                                <option value="1">Deluxe</option>
                                <option value="2">Suite</option>
                                <option value="3">Executive</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="maxOccupancy" className="form-label">Max Occupancy *</label>
                            <input
                                type="number"
                                id="maxOccupancy"
                                className="form-control border border-dark"
                                min="1"
                                required
                                {...register('maxOccupancy', {
                                    required: true,
                                    min: { value: 1, message: "Occupancy must be at least 1" },
                                    valueAsNumber: true
                                })}
                            />
                            {errors.maxOccupancy && <span className="text-danger">{errors.maxOccupancy.message}</span>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="buildingId" className="form-label">Building *</label>
                            <select
                                id="buildingId"
                                className="form-control border border-dark"
                                required
                                {...register('buildingId', { required: true })}
                            >
                                <option value="">Select Building</option>
                                {buildings.length > 0 ? (
                                    buildings.map((building) => (
                                        <option key={building.id} value={building.id}>{building.name}</option>
                                    ))
                                ) : (
                                    <option disabled>No buildings available</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="billingProfileId" className="form-label">Billing Profile</label>
                            <select
                                id="billingProfileId"
                                className="form-control border border-dark"
                                {...register('billingProfileId')}
                            >
                                <option value="">Select Billing Profile</option>
                                {billingProfiles.length > 0 ? (
                                    billingProfiles.map((profile) => (
                                        <option key={profile.id} value={profile.id}>{profile.name}</option>
                                    ))
                                ) : (
                                    <option disabled>No active billing profiles available</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="remarks" className="form-label">Remarks *</label>
                            <textarea
                                id="remarks"
                                className="form-control border border-dark"
                                rows="3"
                                {...register('remarks')}
                            ></textarea>
                        </div>

                        <div className="text-start mt-2">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditRoom;