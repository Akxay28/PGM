import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
 
  
  return (
    //   "userName": "hardik@outrightsoftware.com",
  // "password": "Admin@123",

  // {
  //   "pageSize": 0,
  //   "pageIndex": 0,
  //   "orderBy": [
  //     "string"
  //   ],
  //   "searchCriterias": {
  //     "additionalProp1": "string",
  //     "additionalProp2": "string",
  //     "additionalProp3": "string"
  //   },
  //   "allRecords": true
  // }
    <>
      <div><Toaster /></div>
      <div className="container">
        <h1 className='text-center my-5'>Welcome to the Dashboard </h1>
      </div>

    </>
  )
}

export default Dashboard