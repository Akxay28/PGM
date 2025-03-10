import {
  cilBook,
  cilContact,
  cilFile,
  cilLan,
  cilListNumbered,
  cilPencil,
  cilPeople
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'
import React from 'react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'ΛK⚡HΛY',
  //   // to: '/dashboard'
  //   to: '/TeachersList'
  // },

  {
    component: CNavItem,
    name: 'Clients',
    to: '/manageClients',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Billing',
    to: '/billing',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Building',
    to: '/building',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Role',
    to: '/role',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  }
]

export default _nav
