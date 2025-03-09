import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddBilling = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const apiUrl = config.BASE_URL;
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    // Fetch cities data
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const requestData = { allRecords: true };
                const response = await axios.post('https://pgmapi.outrightsoftware.com/api/City/List', requestData);
                // console.log("Full API Response:", response.data);

                if (response.data && Array.isArray(response.data.records)) {
                    setCities(response.data.records);
                } else {
                    console.error("Unexpected response structure:", response.data);
                    setCities([]);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                setCities([]);
            }
        };
        fetchCities();
    }, []);

    const onSubmit = async (data) => {

        // Getting clientId from local storage
        const getLocalData = JSON.parse(localStorage.getItem('token'));
        // console.log(getLocalData.clientId, 'Client ID');

        const { name, address1, address2, cityId, pincode, gstNumber } = data;

        const requestData = {
            name: name,
            address1: address1,
            address2: address2,
            cityId: Number(cityId),
            pincode: pincode,
            gstNumber: gstNumber,
            allRecords: true,
            clientId: getLocalData.clientId
        };

        console.log(requestData, 'requestData');

        try {
            const response = await axios.post(`${apiUrl}/BillingProfile/Insert`, requestData);
            console.log(response.data, 'response.data on submit');
            toast.success("Billing Created successfully");
            setTimeout(() => {
                navigate('/billing');
            }, 1500);
        } catch (error) {
            console.error('Error during submission:', error);
            toast.error("Error updating client information");
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Add Billing</h1>
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
                        <label htmlFor="address1" className="form-label">Address Line 1 *</label>
                        <input
                            type="text"
                            id="address1"
                            className="form-control border border-dark"
                            required
                            {...register('address1', { required: true })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="address2" className="form-label">Address Line 2 *</label>
                        <input
                            type="text"
                            id="address2"
                            className="form-control border border-dark"
                            required
                            {...register('address2', { required: true })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">City *</label>
                        <select id="city" className="form-control border border-dark" required {...register('cityId', { required: true })}>
                            <option value="">Select City</option>
                            {cities.length > 0 ? (
                                cities.map((city, index) => (
                                    <option key={index} value={city.id}>{city.name}</option>
                                ))
                            ) : (
                                <option disabled>Loading cities...</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="pincode" className="form-label">Pincode *</label>
                        <input
                            type="text"
                            id="pincode"
                            className="form-control border border-dark"
                            required
                            {...register('pincode', {
                                required: true,
                                pattern: {
                                    value: /^[1-9][0-9]{5}$/,
                                    message: 'Invalid Pincode format. Should be 6 digits and not start with 0'
                                }
                            })}
                        />
                        {errors.pincode && <div className="text-danger mt-1">{errors.pincode.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gstNumber" className="form-label">GST Number</label>
                        <input
                            type="text"
                            id="gstNumber"
                            className="form-control border border-dark"
                            {...register('gstNumber', {
                                pattern: {
                                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                    message: 'Invalid GST Number format'
                                }
                            })}
                        />
                        {errors.gstNumber && <div className="text-danger mt-1">{errors.gstNumber.message}</div>}
                    </div>

                    <div className="text-start mt-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBilling;