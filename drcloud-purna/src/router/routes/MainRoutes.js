import { lazy } from 'react'

const MainRoutes = [
  {
    path: '/home',
    exact: true,
    component: lazy(() => import('@views/home'))
  },
  {
    path: '/doctor-schedules',
    exact: true,
    component: lazy(() => import('@views/doctor-schedules'))
  },
  {
    path: '/appointments',
    exact: true,
    component: lazy(() => import('@views/appointments'))
  },
  {
    path: '/appointments/details',
    exact: true,
    component: lazy(() => import('@views/appointments/AppointmentDetail'))
  },
  {
    path: '/clinic-queue',
    exact: true,
    component: lazy(() => import('@views/clinic-queue'))
  },
  { path: '/clinic-queue/in-progress', exact: true, component: lazy(() => import('@views/clinic-queue/In-progress')) },
  {
    path: '/patients/contact-info',
    exact: true,
    component: lazy(() => import('@views/patients/contact-info'))
  },
  { path: '/patients/medical-records', exact: true, component: lazy(() => import('@views/patients/medical-records')) }
]

export default MainRoutes
