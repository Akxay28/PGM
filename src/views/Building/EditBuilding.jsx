import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const EditBuilding = () => {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the building ID from URL params
    const apiUrl = config.BASE_URL;
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [building, setBuilding] = useState(null);

    // Fetch building details
    useEffect(() => {
        const fetchBuildingDetails = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'))?.token;
                if (!token) throw new Error("Token not found");

                const response = await axios.post(
                    `${apiUrl}/Building/List`,
                    { allRecords: true },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const buildingData = response.data.records?.find(
                    building => building.id === parseInt(id)
                );

                if (buildingData) {
                    setBuilding(buildingData);
                    setValue('buildingName', buildingData.name);
                    setValue('billingProfileId', buildingData.billingProfileId);
                    setValue('remarks', buildingData.remarks || '');
                } else {
                    toast.error("Building not found");
                    navigate('/building');
                }
            } catch (error) {
                console.error('Error fetching building details:', error);
                toast.error("Failed to fetch building details");
                navigate('/building');
            }
        };

        fetchBuildingDetails();
    }, [id, setValue, navigate, apiUrl]);

    // Fetch billing profiles
    useEffect(() => {
        const fetchBillingProfiles = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'))?.token;
                if (!token) throw new Error("Token not found");

                const response = await axios.post(
                    `${apiUrl}/BillingProfile/List`,
                    { allRecords: true },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setBillingProfiles(response.data.records?.filter(profile => profile.isActive) || []);
            } catch (error) {
                console.error('Error fetching billing profiles:', error);
                toast.error("Failed to fetch billing profiles");
            }
        };

        fetchBillingProfiles();
    }, [apiUrl]);

    // On Submit function to update building
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const tokenData = JSON.parse(localStorage.getItem('token'));
            const token = tokenData?.token;
            const clientId = tokenData?.clientId;

            if (!token || !clientId) {
                throw new Error("Authentication error. Please log in again.");
            }

            const requestData = {
                id: parseInt(id),
                clientId,
                name: data.buildingName,
                billingProfileId: Number(data.billingProfileId),
                remarks: data.remarks,
                isActive: building?.isActive // Maintain current active status
            };

            const response = await axios.put(
                `${apiUrl}/Building/Update`,  // Change this to `PUT`
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.result === true) {
                toast.success("Building updated successfully");
                setTimeout(() => navigate('/building'), 1500); // Ensure navigation works smoothly
            } else {
                toast.error("Failed to update building");
            }
        } catch (error) {
            console.error('Error during update:', error);
            toast.error("Failed to update building");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Edit Building</h1>
                {building ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Building Name */}
                        <div className="mb-3">
                            <label htmlFor="building-name" className="form-label">Building Name *</label>
                            <input
                                type="text"
                                id="building-name"
                                className="form-control border border-dark"
                                required
                                {...register('buildingName', { required: true })}
                            />
                        </div>

                        {/* Billing Profile ID */}
                        <div className="mb-3">
                            <label htmlFor="billingProfileId" className="form-label">Billing Profile ID *</label>
                            <select
                                id="billingProfileId"
                                className="form-select border border-dark"
                                required
                                {...register('billingProfileId', { required: true })}
                            >
                                <option value="">Select Billing Profile</option>
                                {billingProfiles.map(profile => (
                                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                                ))}
                            </select>
                            {billingProfiles.length === 0 && (
                                <small className="text-muted">No active billing profiles available</small>
                            )}
                        </div>

                        {/* Remarks */}
                        <div className="mb-3">
                            <label htmlFor="remarks" className="form-label">Remarks</label>
                            <textarea
                                id="remarks"
                                className="form-control border border-dark"
                                {...register('remarks')}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                Update
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading building details...</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default EditBuilding;