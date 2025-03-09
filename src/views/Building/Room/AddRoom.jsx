import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const AddRoom = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const apiUrl = config.BASE_URL;
    const navigate = useNavigate();

    // Example buildings data - replace with your actual data source
    const buildings = [
        { id: 1, name: 'Building A' },
        { id: 2, name: 'Building B' },
        { id: 3, name: 'Building C' }
    ];

    // Example billing profiles data - replace with your actual data source
    const billingProfiles = [
        { id: 1, name: 'Standard' },
        { id: 2, name: 'Premium' },
        { id: 3, name: 'Corporate' }
    ];

    const onSubmit = async (data) => {
        // Getting clientId from local storage
        const getLocalData = JSON.parse(localStorage.getItem('token'));

        const { name, roomType, maxOccupancy, buildingId, billingProfileId, remarks } = data;

        const requestData = {
            name: name,
            roomType: roomType,
            maxOccupancy: Number(maxOccupancy),
            buildingId: Number(buildingId),
            billingProfileId: billingProfileId ? Number(billingProfileId) : null,
            remarks: remarks,
            clientId: getLocalData?.clientId
        };

        console.log(requestData, 'requestData');

        try {
             // const response = await axios.post(`${apiUrl}/Room/Insert`, requestData);
            // console.log(response.data, 'response.data on submit');
            toast.success("Room added successfully");
            // setTimeout(() => {
            //     navigate('/rooms');
            // }, 1500);
        } catch (error) {
            console.error('Error during submission:', error);
            toast.error("Error adding room information");
        }
    };

    return (
        <>
            <div><Toaster /></div>
            <div className="container shadow bg-white p-5 rounded">
                <h1 className="text-center mb-4">Add Room</h1>
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
                        <input
                            type="text"
                            id="roomType"
                            className="form-control border border-dark"
                            required
                            {...register('roomType', { required: true })}
                        />
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
                                <option disabled>Loading buildings...</option>
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
                                <option disabled>Loading billing profiles...</option>
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
            </div>
        </>
    )
}

export default AddRoom