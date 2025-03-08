import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import config from '../../config';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const EditUsers = () => {
    const apiUrl = config.BASE_URL;
    const { register, handleSubmit, setValue, control, watch } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [RoleId, setRoleId] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    // Watch the password field to check if it's being changed
    const newPassword = watch('newPassword');

    // Fetch User Data by ID first
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/User/GetById/${id}`);
                console.log('User data:', response.data.records[0]);

                if (response.status === 200) {
                    setUserData(response.data.records[0]);
                }
            } catch (err) {
                console.error('Error fetching user data:', err.response ? err.response.data : err.message);
                toast.error('Error loading user data');
            }
        };

        fetchData();
    }, [id, apiUrl]);

    // Fetch Role data
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const requestDatas = { allRecords: true };
                const response = await axios.post(`${apiUrl}/Role/List`, requestDatas);
                if (response.status === 200) {
                    setRoleId(response.data.records);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                toast.error('Error loading roles');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, [apiUrl]);

    // Set form values after both user data and dropdowns are loaded
    useEffect(() => {
        if (userData && !isLoading) {
            setValue('username', userData.username);
            setValue('firstName', userData.firstName);
            setValue('lastName', userData.lastName);
            setValue('email', userData.email);
            setValue('roleId', Number(userData.roleId));
        }
    }, [userData, isLoading, setValue]);

    // Submit form and update user data
    const onSubmit = async (data) => {
        const { username, firstName, lastName, email, roleId, oldPassword, newPassword } = data;

        // Getting the ClientId from LocalStorage
        const localData = JSON.parse(localStorage.getItem('token'));
        const clientId = localData.clientId;

        try {
            // First update the user data (without password)
            const userData = {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                clientId: clientId,
                roleId: roleId,
            };

            const response = await axios.put(`${apiUrl}/User/Update`, userData);
            console.log('User updated:', response.data);
            // If password fields are filled, update password separately
            if (showPasswordFields && oldPassword && newPassword) {
                const passwordData = {
                    userId: id,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                };

                await axios.put(`${apiUrl}/User/ChangePassword`, passwordData);
                toast.success('User and password updated successfully');
                // console.log('Password updated', response.data);

            } else {
                toast.success('User updated successfully');
            }

            // Navigate back after a short delay
            setTimeout(() => {
                navigate('/users');
            }, 1500);
        } catch (error) {
            if (error.response) {
                console.error(`Error: `, error.response.data);
                const errorMessage = error.response.data.errors ?
                    Object.values(error.response.data.errors).flat().join(', ') :
                    error.response.data.message || 'Error updating user';
                toast.error(`Error: ${errorMessage}`);
            } else {
                console.error(`Error: ${error.message}`);
                toast.error('Error updating user');
            }
        }
    };

    if (isLoading) {
        return <div className="container text-center mt-5">Loading user data...</div>;
    }

    return (
        <>
            <div><Toaster /></div>

            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Edit Users</h1>
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

                    {/* Change Password Checkbox */}
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="changePassword"
                            onChange={() => setShowPasswordFields(!showPasswordFields)}
                            checked={showPasswordFields}
                        />
                        <label className="form-check-label" htmlFor="changePassword">
                            Change Password
                        </label>
                    </div>

                    {/* Password Fields (conditionally shown) */}
                    {showPasswordFields && (
                        <>
                            {/* Old Password */}
                            <div className="mb-3">
                                <label htmlFor="oldPassword" className="form-label">Current Password *</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    className="form-control border border-dark"
                                    autoComplete="off"
                                    placeholder="Enter current password"
                                    {...register('oldPassword', { required: showPasswordFields })}
                                />
                            </div>

                            {/* New Password */}
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">New Password *</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control border border-dark"
                                    autoComplete="off"
                                    placeholder="Enter new password"
                                    {...register('newPassword', { required: showPasswordFields })}
                                />
                            </div>
                        </>
                    )}

                    <div className="row">
                        {/* Role Dropdown */}
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role *</label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <select
                                            id="role"
                                            className="form-control border border-dark"
                                            autoComplete="off"
                                            {...field}
                                        >
                                            <option value="">Select Role</option>
                                            {RoleId.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name || role.id}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
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

export default EditUsers;