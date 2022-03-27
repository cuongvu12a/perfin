export default [
  {
    id: 'doctorSchedules',
    title: 'title.doctorSchedules',
    navLink: '/doctor-schedules',
    action: 'read',
    resource: 'doctorSchedules'
  },
  {
    id: 'appointments',
    title: 'title.appointments',
    navLink: '/appointments',
    action: 'read',
    resource: 'appointments'
  },
  {
    id: 'clinicQueue',
    title: 'title.todayExaminations',
    navLink: '/clinic-queue',
    action: 'read',
    resource: 'todayExaminations'
  },
  {
    id: 'lists',
    title: 'title.lists',
    children: [
      {
        id: 'contacts',
        title: 'title.contacts',
        navLink: '/patients/contact-info',
        action: 'read',
        resource: 'contacts'
      },
      {
        id: 'medicalRecords',
        title: 'title.medicalRecords',
        navLink: '/patients/medical-records',
        action: 'read',
        resource: 'medicalRecords'
      }
    ]
  }
]
