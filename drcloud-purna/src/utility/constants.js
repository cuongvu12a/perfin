export const CountryEnum = {
  Vietnam: 192,
  Other: 0
}

export const CityEnum = {
  HaNoi: 24,
  NgheAn: 40
}

export const RecurrenceOptionEnum = {
  NoRepeat: 0,
  Daily: 1,
  WeeklyOnDayOfWeek: 2,
  EveryWorkDaysOfWeek: 3,
  Custom: 4
}

export const RecurrenceFrequencyEnum = {
  DAILY: 3,
  WEEKLY: 2,
  MONTHLY: 1
}

export const RecurrenceEndsEnum = {
  Never: '0',
  OnDay: '1',
  After: '2'
}

export const EditDoctorScheduleCaseEnum = {
  SingleToSingle: 1,
  SingleToRecurring: 2,
  RecurringInfoOnly: 3,
  RecurringInfoAndRrule: 4,
  RecurringInfoAndToSingle: 5
}

export const EditDoctorScheduleApplyToEnum = {
  ThisOccurrence: 1,
  ThisAndFollowingOccurrences: 2
}

export const RecurrenceByWeekdayEnum = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6
}

export const AppointmentStatusEnum = {
  NotApproved: 1000,
  Approved: 2000,
  CheckedIn: 3000,
  InProgress: 4000,
  Finished: 9000,
  Canceled: 9999,
  Invalid: 10000
}

export const AppointmentStatusDisplayConfig = {
  [AppointmentStatusEnum.NotApproved]: { title: 'NotApproved', color: 'light-secondary' },
  [AppointmentStatusEnum.Approved]: { title: 'Approved', color: 'light-primary' },
  [AppointmentStatusEnum.CheckedIn]: { title: 'CheckedIn', color: 'primary' },
  [AppointmentStatusEnum.InProgress]: { title: 'InProgress', color: 'success' },
  [AppointmentStatusEnum.Finished]: { title: 'Finished', color: 'light-info' },
  [AppointmentStatusEnum.Canceled]: { title: 'Canceled', color: 'light-dark' },
  [AppointmentStatusEnum.Invalid]: { title: 'Invalid', color: 'warning' }
}

export const ScheduleSlotAvailableDisplayConfig = {
  notApproved: { title: 'NotApproved', color: 'light-secondary' },
  available: { title: 'Available', color: 'success' },
  full: { title: 'Full', color: 'light-danger' }
}

export const GenderEnum = {
  Male: 0,
  Female: 1
}

export const PermissionTypeEnum = {
  None: 0,
  Read: 10,
  Write: 20
}

export const TabEnum = {
  Settings: 'settings',
  Dashboard: 'dashboard',
  Lists: 'lists'
}

export const TitleTabEnum = {
  Settings: {
    id: 'title.clinicSettings',
    default: 'Clinic Settings'
  },
  Dashboard: {
    id: 'title.dashboard',
    default: 'Dashboard'
  },
  Lists: {
    id: 'title.lists',
    default: 'Lists'
  }
}

export const FrontEndScreenEnum = {
  GeneralSettings: 1,
  Locations: 2,
  Specialties: 3,
  Doctors: 4,
  Symptoms: 5,
  Users: 6,
  UserRoles: 7,
  UserGroups: 8,
  DoctorSchedules: 9,
  Appointments: 10,
  TodayExaminations: 11,
  Contacts: 12,
  Properties: 13,
  Forms: 14,
  Medicines: 15,
  MedicalRecords: 17
}

export const PermissionScreens = [
  { frontendScreenTitle: 'title.generalSettings', frontendScreenId: 1, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.locations', frontendScreenId: 2, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.specialties', frontendScreenId: 3, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.doctors', frontendScreenId: 4, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.symptomSuggestion', frontendScreenId: 5, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.users', frontendScreenId: 6, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.userRoles', frontendScreenId: 7, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.userGroups', frontendScreenId: 8, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.doctorSchedules', frontendScreenId: 9, tab: TabEnum.Dashboard },
  { frontendScreenTitle: 'title.appointments', frontendScreenId: 10, tab: TabEnum.Dashboard },
  { frontendScreenTitle: 'title.todayExaminations', frontendScreenId: 11, tab: TabEnum.Dashboard },
  // { frontendScreenTitle: 'title.patientListing', frontendScreenId: 12, tab: TabEnum.Dashboard },
  { frontendScreenTitle: 'title.properties', frontendScreenId: 13, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.forms', frontendScreenId: 14, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.medicineLibrary', frontendScreenId: 15, tab: TabEnum.Settings },
  { frontendScreenTitle: 'title.contacts', frontendScreenId: FrontEndScreenEnum.Contacts, tab: TabEnum.Lists },
  {
    frontendScreenTitle: 'title.medicalRecords',
    frontendScreenId: FrontEndScreenEnum.MedicalRecords,
    tab: TabEnum.Lists
  }
]

export const UserStatusEnum = {
  Inactive: 500,
  Active: 1000
}

export const UserStatusDisplayConfig = {
  [UserStatusEnum.Inactive]: { title: 'Inactive', color: 'light-warning' },
  [UserStatusEnum.Active]: { title: 'Active', color: 'light-success' }
}

export const SkillsEnum = [
  { skillLabel: 'label.receptionist', skillId: 1 },
  { skillLabel: 'label.assistant', skillId: 2 },
  { skillLabel: 'label.doctor', skillId: 3 }
]

export const RoleTypeEnum = {
  Owner: 10,
  Admin: 20,
  UserDefined: 30
}

export const FeatureEnum = {
  101: { action: 'add', subject: 'appointments' },
  102: { action: 'approve', subject: 'appointments' },
  103: { action: 'checkIn', subject: 'appointments' },
  104: { action: 'startFinish', subject: 'appointments' },
  105: { action: 'cancel', subject: 'appointments' }
}

export const ScreenEnum = {
  1: 'general',
  2: 'locations',
  3: 'specialties',
  4: 'doctors',
  5: 'symptoms',
  6: 'users',
  7: 'roles',
  8: 'groups',
  9: 'doctorSchedules',
  10: 'appointments',
  11: 'todayExaminations',
  12: 'contacts',
  13: 'properties',
  14: 'forms',
  15: 'medicineLibrary',
  17: 'medicalRecords'
}

export const KeyBoardEnum = {
  Escape: 'Escape',
  Tab: 'Tab',
  Enter: 'Enter'
}

export const FrontEndFeatureEnum = {
  AddAppointment: 101,
  ApproveAppointment: 102,
  CheckInAppointment: 103,
  StartFinishAppointment: 104,
  CancelAppointment: 105
}

export const AppointmentConfig = {
  AllowBookingBeforeMinutes: 60
}

export const PhysicalFileTypeEnum = {
  Avatar: 1
}

export const PhysicalFileStatusEnum = {
  New: 0,
  OK: 1,
  WillBeDeleted: 2,
  Deleted: 3,
  Corrupted: 4
}

export const EntityTypeEnum = {
  ResultSheet: 3
}

export const PropertyValueTypeEnum = {
  FreeText: 1,
  ListOfOptions: 2,
  Date: 3,
  DateTime: 4
}

export const MedicineUnitTypeEnum = {
  Tablet: 1,
  Blister: 2,
  Packet: 3,
  Sachet: 4,
  Tube: 5,
  Bottle: 6,
  Set: 7
}

export const PrintTemplateList = [
  { templateName: 'Mặc định/Default 1', templateId: 1, isDefault: true },
  { templateName: 'Mặc định/Default 2', templateId: 2, isDefault: false },
  { templateName: 'Mặc định/Default 3', templateId: 3, isDefault: false }
]
