import { lazy } from 'react'

const SettingsRoutes = [
  {
    path: '/clinic-settings',
    exact: true,
    component: lazy(() => import('@views/clinic-settings'))
  },
  {
    path: '/clinic-settings/:tab',
    exact: true,
    component: lazy(() => import('@views/clinic-settings'))
  }
]

export default SettingsRoutes
