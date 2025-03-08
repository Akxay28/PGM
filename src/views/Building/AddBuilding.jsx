import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';

const AddBuilding = () => {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const apiUrl = config.BASE_URL;
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // On Submit function to add building
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const getLocalData = JSON.parse(localStorage.getItem('token'));

            // Extract the token
            const token = getLocalData.token

            const { buildingName, billingProfileId, remarks } = data;

            const requestData = {
                clientId: getLocalData.clientId,
                name: buildingName,
                billingProfileId: Number(billingProfileId),
                remarks,
                allRecords: true
            };

            console.log(requestData, 'requestData before API call');

            // Include the token in the request headers
            const response = await axios.post(
                `https://pgmapi.outrightsoftware.com/api/Building/Insert`,
                requestData
                // ,{
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // }
            );

            console.log(response.data, 'response.data on submit');

            if (response.data && response.data.result === true) {
                toast.success("Building added successfully");
                reset(); // Reset form
                navigate('/building'); // Redirect after success
            } else {
                toast.error(`Failed to add building`);
            }
        } catch (error) {
            console.error('Error during submission:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || error.response.data.title || "Server error";
                toast.error(`Failed to add building: ${errorMessage}`);
                console.log('Full error:', error.response.data);
            } else {
                toast.error("Failed to add building");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Add Building</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Building Name */}
                    <div className="mb-3">
                        <label htmlFor="building-name" className="form-label"> Building Name *</label>
                        <input
                            type="text"
                            id="building-name"
                            className="form-control border border-dark"
                            required
                            {...register('buildingName', { required: true })}
                        />
                    </div>

                    {/* Billing Profile id */}
                    <div className="mb-3">
                        <label htmlFor="billingProfileId" className="form-label">Billing Profile ID *</label>
                        <input
                            type="text"
                            id="billingProfileId"
                            className="form-control border border-dark"
                            required
                            {...register('billingProfileId', { required: true })}
                        />
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
                    <div className="text-start mt-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBuilding;