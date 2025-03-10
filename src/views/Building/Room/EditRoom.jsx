import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import config from '../../../config';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const EditRoom = () => {
    const { id } = useParams();  // Get the room ID from the URL params
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const apiUrl = config.BASE_URL;
    const navigate = useNavigate();
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
                    const allProfiles = billingResponse.data.records;
                    const activeProfiles = allProfiles.filter(profile => profile.isActive === true);

                    setBillingProfiles(activeProfiles);
                }

                // Fetch existing room data
                const roomResponse = await axios.get(`${apiUrl}/Room/Get/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (roomResponse.status === 200 && roomResponse.data) {
                    const roomData = roomResponse.data;
                    // Prefill the form with the room data
                    setValue('name', roomData.name);
                    setValue('roomType', roomData.roomType.toString());
                    setValue('maxOccupancy', roomData.maxOccupancy);
                    setValue('buildingId', roomData.buildingId.toString());
                    setValue('billingProfileId', roomData.billingProfileId ? roomData.billingProfileId.toString() : '');
                    setValue('remarks', roomData.remarks);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err.response ? err.response.data : err.message);
                toast.error("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, id]);

    const onSubmit = async (data) => {
        const getLocalData = JSON.parse(localStorage.getItem('token'));
        const token = getLocalData.token;
        const clientId = getLocalData?.clientId;

        const { name, roomType, maxOccupancy, buildingId, billingProfileId, remarks } = data;

        const requestData = {
            id: id,  // Pass the room ID to update
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
            const response = await axios.put(`${apiUrl}/Room/Update`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Room updated successfully");
            setTimeout(() => {
                navigate('/room');
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
