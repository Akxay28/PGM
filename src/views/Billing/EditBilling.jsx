import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import config from '../../config';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBilling = () => {
    const apiUrl = config.BASE_URL;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    console.log(id, 'id');

    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch billing data on component mount
    useEffect(() => {
        const fetchBillingData = async () => {
            setLoading(true);
            try {
                // Getting the token from LocalStorage
                const localData = JSON.parse(localStorage.getItem('token'));
                const token = localData.token;

                // Fetch the billing profile data by ID
                const response = await axios.get(`${apiUrl}/BillingProfile/GetById/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Populate form with the fetched data
                const billingData = response.data.records[0];

                setValue('name', billingData.name);
                setValue('address1', billingData.address1);
                setValue('address2', billingData.address2);
                setValue('cityId', Number(billingData.cityId));
                setValue('pincode', billingData.pincode);
                setValue('gstNumber', billingData.gstNumber);

                console.log('Billing data loaded:', billingData);

                // Also fetch cities for dropdown
                fetchCities();

            } catch (error) {
                console.error('Error fetching billing data:', error);
                toast.error('Failed to load billing data');
            } finally {
                setLoading(false);
            }
        };

        const fetchCities = async () => {
            try {
                const localData = JSON.parse(localStorage.getItem('token'));
                const token = localData.token;

                const response = await axios.post(`${apiUrl}/City/List`,
                    { allRecords: true },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data && response.data.records) {
                    setCities(response.data.records);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                toast.error('Failed to load cities');
            }
        };

        if (id) {
            fetchBillingData();
        } else {
            setLoading(false);
            toast.error('No billing ID provided');
        }
    }, [id, apiUrl, setValue]);

    // Submit form and update billing data
    const onSubmit = async (data) => {
        try {
            // Getting the token from LocalStorage
            const localData = JSON.parse(localStorage.getItem('token'));
            const token = localData.token;
            const clientId = localData.clientId;

            // Prepare the payload with clientId and form data
            const billingData = {
                ...data,
                id: parseInt(id), // Include the ID for update
                clientId: parseInt(clientId)
            };

            console.log('Updating billing with data:', billingData);

            // Make the API call to update the billing profile
            const response = await axios.put(
                `${apiUrl}/BillingProfile/Update`,
                billingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Billing updated:', response.data);
            toast.success('Billing profile updated successfully');

            // Navigate back after a short delay
            setTimeout(() => {
                navigate('/billing');
            }, 1500);
        } catch (error) {
            if (error.response) {
                console.error(`Error: `, error.response.data);
                toast.error(`Update failed: ${error.response.data.message || 'Unknown error'}`);
            } else {
                console.error(`Error: ${error.message}`);
                toast.error('Error updating billing profile');
            }
        }
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <>
            <div><Toaster /></div>

            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Edit Billing Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name *</label>
                        <input
                            type="text"
                            id="name"
                            className={`form-control border ${errors.name ? 'border-danger' : 'border-dark'}`}
                            {...register('name', { required: 'Name is required' })}
                            autoComplete="off"
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                    </div>

                    {/* Address 1 */}
                    <div className="mb-3">
                        <label htmlFor="address1" className="form-label">Address Line 1 *</label>
                        <input
                            type="text"
                            id="address1"
                            className={`form-control border ${errors.address1 ? 'border-danger' : 'border-dark'}`}
                            autoComplete="off"
                            {...register('address1', { required: 'Address is required' })}
                        />
                        {errors.address1 && <span className="text-danger">{errors.address1.message}</span>}
                    </div>

                    {/* Address 2 */}
                    <div className="mb-3">
                        <label htmlFor="address2" className="form-label">Address Line 2</label>
                        <input
                            type="text"
                            id="address2"
                            className="form-control border border-dark"
                            autoComplete="off"
                            {...register('address2')}
                        />
                    </div>

                    {/* City */}
                    <div className="mb-3">
                        <label htmlFor="cityId" className="form-label">City *</label>
                        <select
                            id="cityId"
                            className={`form-select border ${errors.cityId ? 'border-danger' : 'border-dark'}`}
                            {...register('cityId', { required: 'City is required' })}
                        >
                            <option value="">Select a city</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name || 'Unknown City'}</option>
                            ))}
                        </select>
                        {errors.cityId && <span className="text-danger">{errors.cityId.message}</span>}
                    </div>

                    {/* Pincode */}
                    <div className="mb-3">
                        <label htmlFor="pincode" className="form-label">Pincode *</label>
                        <input
                            type="text"
                            id="pincode"
                            className={`form-control border ${errors.pincode ? 'border-danger' : 'border-dark'}`}
                            autoComplete="off"
                            {...register('pincode', {
                                required: 'Pincode is required',
                                pattern: {
                                    value: /^\d{6}$/,
                                    message: 'Pincode must be 6 digits'
                                }
                            })}
                        />
                        {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
                    </div>

                    {/* GST Number */}
                    <div className="mb-3">
                        <label htmlFor="gstNumber" className="form-label">GST Number *</label>
                        <input
                            type="text"
                            id="gstNumber"
                            className={`form-control border ${errors.gstNumber ? 'border-danger' : 'border-dark'}`}
                            autoComplete="off"
                            {...register('gstNumber', {
                                required: 'GST Number is required',
                                pattern: {
                                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                    message: 'Invalid GST Number format'
                                }
                            })}
                        />
                        {errors.gstNumber && <span className="text-danger">{errors.gstNumber.message}</span>}
                    </div>

                    <div className="text-start mt-4">
                        <button type="submit" className="btn btn-primary me-2">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/billing')}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditBilling;