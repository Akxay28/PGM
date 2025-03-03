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
    name: 'All Users',
    to: '/theme/AllUsers',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'CMS Pages',
    to: '/theme/CMS',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Email Templates',
    to: '/theme/EmailTem',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Social Media',
    to: '/theme/SocialMedia',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },


]

export default _nav
