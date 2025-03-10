import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const AddRoom = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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
                    console.log("Buildings data:", buildingsResponse.data.records);
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
                    console.log("Billing profiles data:", billingResponse.data.records);
                    setBillingProfiles(billingResponse.data.records);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err.response ? err.response.data : err.message);
                toast.error("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    const onSubmit = async (data) => {
        // Getting clientId from local storage
        const getLocalData = JSON.parse(localStorage.getItem('token'));
        const token = getLocalData.token;
        const clientId = getLocalData?.clientId;

        const { name, roomType, maxOccupancy, buildingId, billingProfileId, remarks } = data;

        // Create the proper request structure based on the API requirements
        const requestData = {
            name: name,
            roomType: parseInt(roomType, 10) || 0,
            maxOccupancy: Number(maxOccupancy),
            buildingId: Number(buildingId),
            billingProfileId: billingProfileId ? Number(billingProfileId) : null,
            remarks: remarks,
            clientId: Number(clientId),
            isActive: true
        };

        console.log(requestData, 'requestData');

        console.log("Request payload:", requestData);

        try {
            const response = await axios.post(`${apiUrl}/Room/Insert`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API response:', response.data);
            toast.success("Room added successfully");
            setTimeout(() => {
                // navigate('/rooms');
            }, 1500);
        } catch (error) {
            console.error('Error during submission:', error.response ? error.response.data : error);

            // Display more specific error message if available
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                toast.error(errorMessages.join(', '));
            } else {
                toast.error("Error adding room information");
            }
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Add Room</h1>

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
                                    <option disabled>No billing profiles available</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="remarks" className="form-label">Remarks *</label>
                            <textarea
                                id="remarks"
                                className="form-control border border-dark"
                                rows="3"
                                required
                                {...register('remarks', { required: true })}
                            ></textarea>
                        </div>

                        <div className="text-start mt-2">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    )
}

export default AddRoom