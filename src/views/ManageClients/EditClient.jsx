import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import config from '../../config';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const EditClient = () => {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const { id } = useParams()
    // console.log(id, 'id');

    const apiUrl = config.BASE_URL;

    // fetching the data to get the id from api
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/Client/GetById/${id}`);

                // Check if response was successful (status 200)
                if (response.status === 200) {
                    console.log('Client data:', response.data.records[0]);
                    setValue('name', response.data.records[0].name);
                    setValue('email', response.data.records[0].email);
                    setValue('primaryContact', response.data.records[0].primaryContact);
                    setValue('secondaryContact', response.data.records[0].secondaryContact);
                } else {
                    console.log('Request failed with status:', response.status);
                }
            } catch (err) {
                console.error('Error fetching client data:', err.response ? err.response.data : err.message);
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Empty dependency array ensures this runs once when the component mounts


    // submiting form

    const onSubmit = async (data) => {
        const { name, email, primaryContact, secondaryContact } = data;

        const requestData = {
            id: id,
            name: name,
            email: email,
            primaryContact: primaryContact,
            secondaryContact: secondaryContact
        };

        try {
            const response = await axios.put(`${apiUrl}/Client/Update`, requestData);
            console.log('Response from put:', response);
            toast.success("Client updated successfully");
            setTimeout(() => {
                navigate('/manageClients');
            }, 1500);
        } catch (error) {
            if (error.response) {
                console.log(`Error: ${error.response.data.message}`);
                toast.error("Error updating client");
            }
        }
    };


    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded  ">
                <h1 className="text-center mb-4">Edit Client</h1>
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
    )
}

export default EditClient