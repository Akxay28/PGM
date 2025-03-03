import React from 'react'

const Login = React.lazy(() => import('./views/Login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AllUsers = React.lazy(() => import('./views/theme/AllUsers'))
const CMS = React.lazy(() => import('./views/theme/CMS'))
const EmailTem = React.lazy(() => import('./views/theme/EmailTem'))
const SocialMedia = React.lazy(() => import('./views/theme/SocialMedia'))




const routes = [
  { path: '/',    name: 'Login',  element: Login  },
  // { path: '/Register/Login', exact: true, name: 'Register' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme/AllUsers', name: 'All Users', element: AllUsers },
  { path: '/theme/CMS', name: 'CMS', element: CMS },
  { path: '/theme/EmailTem', name: 'EmailTem', element: EmailTem },
  { path: '/theme/SocialMedia', name: 'SocialMedia', element: SocialMedia },
]

export default routes
