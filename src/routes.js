import React from 'react'

const Login = React.lazy(() => import('./views/Login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ManageClient = React.lazy(() => import('./views/Manage Clients/ManageClients'))
const Users = React.lazy(() => import('./views/Users/Users'))
const Billing = React.lazy(() => import('./views/Billing/Billing'))
const Building = React.lazy(() => import('./views/Building/Building'))
const Room = React.lazy(() => import('./views/Room/Room'))
const Bed = React.lazy(() => import('./views/Bed/Bed'))
 
const routes = [
  { path: '/',    name: 'Login',  element: Login  },
  // { path: '/Register/Login', exact: true, name: 'Register' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard }, 
  { path: '/manageClients', name: 'ManageClient', element: ManageClient },
  { path: '/users', name: 'Users', element: Users },
  { path: '/billing', name: 'Billing', element: Billing },
  { path: '/building', name: 'Buidling', element: Building },
  { path: '/room', name: 'Room', element: Room },
  { path: '/bed', name: 'Bed', element: Bed },
  
]

export default routes
