import axios from 'axios';
// import { set } from 'core-js/core/dict';
import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const apiUrl = config.BASE_URL;

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${apiUrl}/Client/Insert`, data);
            console.log(response.data, 'response.data on submit');
            toast.success("Client updated successfully");
            setTimeout(() => {
                navigate('/manageClients');
            }, 1500);
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded  ">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Add Client</h2>
                        </div>
                        <div className="col-md-6">
                            <button
                                className="btn btn-primary float-end"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="client-name" className="form-label">Name *</label>
                        <input
                            type="text"
                            id="client-name"
                            name="name"
                            className="form-control border border-dark "
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
                            {...register('secondaryContact')}
                        />
                    </div>

                    <div className="text-start mt-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default AddClient;
