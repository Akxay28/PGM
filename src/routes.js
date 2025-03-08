import React from 'react'

const Login = React.lazy(() => import('./views/Login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ManageClient = React.lazy(() => import('./views/ManageClients/ManageClients'))
const Users = React.lazy(() => import('./views/Users/Users'))
const Billing = React.lazy(() => import('./views/Billing/Billing'))
const Building = React.lazy(() => import('./views/Building/Building'))
const Room = React.lazy(() => import('./views/Room/Room'))
const Bed = React.lazy(() => import('./views/Bed/Bed'))
const AddClient = React.lazy(() => import('./views/ManageClients/AddClient'))
const AddUsers = React.lazy(() => import('./views/Users/AddUsers'))
const AddBilling = React.lazy(() => import('./views/Billing/AddBilling'))
const AddBuilding = React.lazy(() => import('./views/Building/AddBuilding'))
const EditClient = React.lazy(() => import('./views/ManageClients/EditClient'))
const EditUsers = React.lazy(() => import('./views/Users/EditUsers'))
const RoleId = React.lazy(() => import('./views/RoleID/RoleID'))

const routes = [
  { path: '/', name: 'Login', element: Login },
  // { path: '/Register/Login', exact: true, name: 'Register' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manageClients', name: 'ManageClient', element: ManageClient },
  { path: '/users', name: 'Users', element: Users },
  { path: '/billing', name: 'Billing', element: Billing },
  { path: '/building', name: 'Buidling', element: Building },
  { path: '/room', name: 'Room', element: Room },
  { path: '/bed', name: 'Bed', element: Bed },
  { path: '/addClient', name: 'addClient', element: AddClient },
  { path: '/editClient/:id', name: 'editClient', element: EditClient },
  { path: '/addUsers', name: 'addUsers', element: AddUsers },
  { path: '/addBilling', name: 'addUsers', element: AddBilling },
  { path: '/addBuilding', name: 'addUsers', element: AddBuilding },
  { path: '/editUsers/:id', name: 'editUsers', element: EditUsers },
  { path: '/role', name: 'editUsres', element: RoleId },
]

export default routes