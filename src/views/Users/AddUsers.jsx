import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const AddUsers = () => {
    const apiUrl = config.BASE_URL;
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [RoleId, setRoleId] = useState([]);

    // Fetch Client Data
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const requestDatas = { allRecords: true };
                const response = await axios.post(
                    `${apiUrl}/Client/List`,
                    requestDatas
                );

                if (response.status === 200) {
                    setClients(response.data.records);
                }
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const requestDatas = { allRecords: true };
                const response = await axios.post(
                    `${apiUrl}/Role/List`,
                    requestDatas
                );

                if (response.status === 200) {
                    setRoleId(response.data.records);
                }
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };

        fetchClients();
        fetchRoles();
    }, []);

    const onSubmit = async (data) => {
        const { username, email, firstName, lastName, password, roleId, clientId } = data;

        const requestData = {
            username,
            email,
            firstName,
            lastName,
            password,
            roleId,
            clientId,
            allRecords: true
        };
        console.log(requestData, 'requestData');

        try {
            const response = await axios.post(
                `${apiUrl}/User/Insert`,
                requestData
            );
            console.log(response.data.message, 'response.data on submit');
            toast.success("User added successfully");
            setTimeout(() => {
                navigate('/users');
            }, 1500);
        } catch (error) {
            toast.error("Failed to add user. Please try again.");
        }
    };

    return (
        <>
            <Toaster />
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Add Users</h1>
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* User Name */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">User Name *</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control border border-dark"
                            {...register('username', { required: true })}
                            autoComplete="off"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control border border-dark"
                            autoComplete="off"
                            {...register('email', { required: true })}
                        />
                    </div>

                    {/* First Name */}
                    <div className="mb-3">
                        <label htmlFor="first-name" className="form-label">First Name *</label>
                        <input
                            type="text"
                            id="first-name"
                            className="form-control border border-dark"
                            autoComplete="off"
                            {...register('firstName', { required: true })}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-3">
                        <label htmlFor="last-name" className="form-label">Last Name *</label>
                        <input
                            type="text"
                            id="last-name"
                            className="form-control border border-dark"
                            autoComplete="off"
                            {...register('lastName', { required: true })}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control border border-dark"
                            autoComplete="off"
                            {...register('password', { required: true })}
                        />
                    </div>

                    <div className="row">
                        {/* Role Dropdown */}
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role *</label>
                                <select
                                    id="role"
                                    className="form-control border border-dark"
                                    autoComplete="off"
                                    {...register('roleId', { required: true, valueAsNumber: true })}
                                >
                                    <option value="">Select Role</option>
                                    {
                                        RoleId.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.id}
                                            </option>
                                        ))
                                    }

                                </select>
                            </div>
                        </div>

                        {/* Client Dropdown */}
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="clientId" className="form-label">Client *</label>
                                <select
                                    id="clientId"
                                    className="form-control border border-dark"
                                    autoComplete="off"
                                    {...register('clientId', { required: true, valueAsNumber: true })}
                                >
                                    <option value="">Select Client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="text-start mt-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddUsers;
