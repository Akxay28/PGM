import axios from 'axios';
// import { set } from 'core-js/core/dict';
import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';

const AddClient = () => {
    const { register, handleSubmit } = useForm();


    const onSubmit = async (data) => {
        try {
            const response = await axios.post('https://pgmapi.outrightsoftware.com/api/Client/Insert', data);
            console.log(response.data, 'response.data on submit');
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="container shadow bg-white p-5 rounded  ">
            <h1 className="text-center mb-4">Add Client</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="client-name" className="form-label">Name *</label>
                    <input
                        type="text"
                        id="client-name"
                        name="name"
                        className="form-control border border-dark "
                        onChange={handleChange}
                        required
                        {...register('name', { required: true })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="client-email" className="form-label">Email *</label>
                    <input
                        type="email"
                        id="client-email"
                        name="email"
                        className="form-control border border-dark"
                        onChange={handleChange}
                        required
                        {...register('email', { required: true })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="primary-contact" className="form-label">Primary Contact *</label>
                    <input
                        type="text"
                        id="primary-contact"
                        name="primaryContact"
                        className="form-control border border-dark"
                        onChange={handleChange}
                        required
                        {...register('primaryContact', { required: true })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="secondary-contact" className="form-label">Secondary Contact</label>
                    <input
                        type="text"
                        id="secondary-contact"
                        name="secondaryContact"
                        className="form-control border border-dark"
                        onChange={handleChange}
                        {...register('secondaryContact')}
                    />
                </div>

                <div className="text-start mt-2">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddClient;
