import axios, { handleRefreshToken } from './base'
import Axios from 'axios'

//#region AUTHENTICATION API

/**
 * Login
 * @param {{
  userName: string;
  password: string;
}} data
*/
export const loginAPI = async data => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data, { __auth: false })
}

export const healthCheckAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/health-check-patient`)
}

export const registerAPI = async (data, lang) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/register-clinic?lang=${lang}`, data, { __auth: false })
}

export const verifyEmailAPI = async data => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-clinic-user`, data, { __auth: false })
}

export const resendConfirmationAPI = async (data, lang) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/resend-confirmation?lang=${lang}`, data, { __auth: false })
}

export const getUserInfoAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/users/me`)
}

export const updateUserAPI = async data => {
  return axios.put(`${process.env.REACT_APP_API_URL}/users/me`, data)
}

export const updatePasswordAPI = async data => {
  return axios.put(`${process.env.REACT_APP_API_URL}/users/change-password`, data)
}

export const forgotPasswordAPI = async (data, lang) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password?lang=${lang}`, data)
}

export const resetPasswordAPI = async (data, lang) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password?lang=${lang}`, data)
}

export const refreshToken = async () => {
  return handleRefreshToken()
}

//#endregion

//#region GENERAL CLINIC SETTING API

export const getClinicGeneralSettingsAPI = async (xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinics/general-settings`, { xScreenId, xFeatureId })
}

/**
 * Update Clinic's General Settings
 * @param {{
 *   clinicName: string;
 *   allowBookingInDays: number;
 * }} data
 */
export const updateClinicGeneralSettingsAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinics/general-settings`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region  *LOCATION API

export const getLocationsAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/locations?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const createLocationsAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/locations`, data, { xScreenId, xFeatureId })
}

export const getLocationsIdAPI = async (locationId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/locations/${locationId}`, { xScreenId, xFeatureId })
}

export const updateLocationsAPI = async (locationId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/locations/${locationId}`, data, { xScreenId, xFeatureId })
}

export const deleteLocationsAPI = async (locationId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/locations/${locationId}`, { xScreenId, xFeatureId })
}

export const updateLocationsEnableAPI = async (locationId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/locations/${locationId}/set-enabled`, data, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  *SPECIALTY API

export const getSpecialtyAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/specialties?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const getAllSpecialtyAPI = async (xScreenId = 0, xFeatureId = 0) => {
  let arr = []
  let i = 0
  do {
    i = i + 1
    const data = await getSpecialtyAPI(100, i, '', xScreenId, xFeatureId)
    arr = [...arr, ...data.data.pageData]
    if (data.data.pageData.length === 0) {
      i = 0
    }
  } while (i !== 0)
  return arr
}

export const createSpecialtyAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/specialties`, data, { xScreenId, xFeatureId })
}

export const getSpecialtiesIdAPI = async (specialtyId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/specialties/${specialtyId}`, { xScreenId, xFeatureId })
}

export const updateSpecialtiesAPI = async (specialtyId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/specialties/${specialtyId}`, data, { xScreenId, xFeatureId })
}

export const deleteSpecialtiesAPI = async (specialtyId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/specialties/${specialtyId}`, { xScreenId, xFeatureId })
}

export const updateSpecialtiesEnableAPI = async (specialtyId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/specialties/${specialtyId}/set-enabled`, data, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  *SYMPTOM API
export const getSymptomsAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/symptoms?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const getSymptomByIdAPI = async (symptomId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/symptoms/${symptomId}`, { xScreenId, xFeatureId })
}

export const createSymptomsAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/symptoms`, data, { xScreenId, xFeatureId })
}

export const updateSymptomAPI = async (symptomId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/symptoms/${symptomId}`, data, { xScreenId, xFeatureId })
}

export const deleteSymptomAPI = async (symptomId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/symptoms/${symptomId}`, { xScreenId, xFeatureId })
}

export const updateSymptomEnableAPI = async (symptomId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/symptoms/${symptomId}/set-enabled`, data, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  *DOCTOR API

export const getDoctorsAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/doctors?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const getDoctorByIdAPI = async (doctorId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/doctors/${doctorId}`, { xScreenId, xFeatureId })
}

export const createDoctorAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/doctors`, data, { xScreenId, xFeatureId })
}

export const updateDoctorAPI = async (doctorId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/doctors/${doctorId}`, data, { xScreenId, xFeatureId })
}

export const deleteDoctorAPI = async (doctorId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/doctors/${doctorId}`, { xScreenId, xFeatureId })
}

export const updateDoctorEnableAPI = async (doctorId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/doctors/${doctorId}/set-enabled`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region  * CLINIC INFO
export const getClinicInfoAPI = async (xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinics/info`, { xScreenId, xFeatureId })
}

//* Doctor Schedule
/**
 * Create new schedule
 * @param {{
 *  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "locationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "startDateTimeUnix": 0,
 *  "endDateTimeUnix": 0,
 *  "recurrenceString": "string"
 * }} data
 */
export const createDoctorScheduleAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/schedules`, data, { xScreenId, xFeatureId })
}

/**
 * Get schedule detail
 * dayily : "RRULE:FREQ=DAILY;INTERVAL=1"
 * WeeklyOnDayOfWeek:"RRULE:FREQ=WEEKLY;INTERVAL=1"
 * EveryWorkDaysOfWeek: 'RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR'
 * Custom: "RRULE:FREQ=MONTHLY;INTERVAL=2"
 */

export const getScheduleByIdAPI = async (scheduleId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/schedules/${scheduleId}`, { xScreenId, xFeatureId })
}
/**
 * Search doctor schedule
 * @param {{
  "keyword": "string",
  "locationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "specialtyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "fromDate": 0,
  "toDate": 0
}} filter 
 */
export const searchDoctorScheduleAPI = async (filter, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/schedules/search`, filter, { xScreenId, xFeatureId })
}

export const updateDoctorScheduleAPI = async (scheduleId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/schedules/${scheduleId}`, data, { xScreenId, xFeatureId })
}

export const deleteDoctorScheduleAPI = async (scheduleId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/schedules/${scheduleId}/delete`, data, { xScreenId, xFeatureId })
}
export const getAppointmentByScheduleIdAPI = async (
  scheduleId,
  occurrenceStart,
  occurrenceEnd,
  xScreenId,
  xFeatureId
) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/schedules/${scheduleId}/get-appointments?occurrenceStart=${occurrenceStart}&occurrenceEnd=${occurrenceEnd}`,
    { xScreenId, xFeatureId }
  )
}
//#endregion

//#region  *CLINIC-PATIENT
export const getClinicPatientAPI = async (keyword, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-patients?keyword=${encodeURI(keyword)}`, {
    xScreenId,
    xFeatureId
  })
}

export const searchClinicPatientsAPI = async (pageSize, pageNumber, filter, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/clinic-patients/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    filter,
    { xScreenId, xFeatureId }
  )
}

export const deleteClinicPatientAPI = async (clinicPatientId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/clinic-patients/${clinicPatientId}`, { xScreenId, xFeatureId })
}

export const createClinicPatientAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinic-patients`, data, { xScreenId, xFeatureId })
}

export const getClinicPatientByIdAPI = async (clinicPatientId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-patients/${clinicPatientId}`, { xScreenId, xFeatureId })
}

export const updateClinicPatientAPI = async (clinicPatientId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-patients/${clinicPatientId}`, data, {
    xScreenId,
    xFeatureId
  })
}

export const searchMedicalRecordsAPI = async (pageSize, pageNumber, filter, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/clinic-patients/search-medical-records?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    filter,
    { xScreenId, xFeatureId }
  )
}

export const getMedicalRecordAPI = async (clinicPatientId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-patients/${clinicPatientId}/medical`, {
    xScreenId,
    xFeatureId
  })
}

export const updateMedicalRecordAPI = async (clinicPatientId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-patients/${clinicPatientId}/medical`, data, {
    xScreenId,
    xFeatureId
  })
}

/**
 * Merge multiple patients to one
 * @param {{ "clinicPatientIds": [ "guid" ] }} data
 * @param {*} xScreenId
 * @param {*} xFeatureId
 */
export const mergeClinicPatientsAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinic-patients/merge`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region  *CLINIC-APPOINTMENT
export const searchClinicAppointmentsAPI = async (pageSize, pageNumber, filter, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/clinic-appointments/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    filter,
    { xScreenId, xFeatureId }
  )
}

export const getExaminationHistoryByPatientIdAPI = async (
  { clinicPatientId, pageSize = 20, pageNumber = 1 },
  xScreenId = 0,
  xFeatureId = 0
) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/result-sheets`, {
    xScreenId,
    xFeatureId,
    params: {
      clinicPatientId,
      pageSize,
      pageNumber
    }
  })
}

export const getAppointmentDetailById = async appointmentId => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/result-sheet`)
}

export const getHistoryByPatientAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/get-by-patient`, data, {
    xScreenId,
    xFeatureId
  })
}

export const getAppointmentHistoryByPatientIdAPI = async (
  { clinicPatientId, pageSize = 20, pageNumber = 1 },
  xScreenId = 0,
  xFeatureId = 0
) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/get-by-patient-v2`, {
    xScreenId,
    xFeatureId,
    params: {
      clinicPatientId,
      pageSize,
      pageNumber
    }
  })
}

export const getPrescriptionDetailByAppointmentId = async appointmentId => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/prescription`)
}

export const getScheduleSlotsAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinic-appointments/get-schedule-slots`, data, {
    xScreenId,
    xFeatureId
  })
}

export const getClinicAppointmentByIdAPI = (appointmentId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}`, { xScreenId, xFeatureId })
}

export const createClinicAppointmentAPI = (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinic-appointments`, data, { xScreenId, xFeatureId })
}

export const updateClinicAppointmentAPI = (appointmentId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}`, data, {
    xScreenId,
    xFeatureId
  })
}

export const getClinicAppointmentByIdForEditAPI = (appointmentId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/details-for-edit`, {
    xScreenId,
    xFeatureId
  })
}

export const getClinicAppointmentsHasInvalid = (xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/has-invalid`, { xScreenId, xFeatureId })
}

export const approveAppointmentAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/approve`, data, { xScreenId, xFeatureId })
}

export const checkInAppointmentAPI = async (appointmentId, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/check-in`, {
    xScreenId,
    xFeatureId
  })
}

export const startAppointmentAPI = async (appointmentId, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/start`, {
    xScreenId,
    xFeatureId
  })
}

export const finishAppointmentAPI = async (appointmentId, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/finish`, {
    xScreenId,
    xFeatureId
  })
}

export const cancelAppointmentAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/cancel`, data, { xScreenId, xFeatureId })
}

export const getNextAppointmentAPI = (doctorId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinic-appointments/next?doctorId=${doctorId}`, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  *Clinic-Queue

export const getTodayAppointmentQueueAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinic-appointments/today-queue`, data, { xScreenId, xFeatureId })
}

export const changeAppointmentDoctorAPI = async (appointmentId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/clinic-appointments/${appointmentId}/change-doctor`, data, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  *Notifications

export const updateDeviceTokenAPI = data => {
  return axios.post(`${process.env.REACT_APP_API_URL}/users/register-device`, data)
}

export const markANotificationAsReadAPI = notificationId => {
  return axios.put(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}/read`)
}

export const markAllNotificationAsReadAPI = () => {
  return axios.put(`${process.env.REACT_APP_API_URL}/notifications/read-all`)
}

export const getNotificationsAPI = (pageSize, pageNumber, lang) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/notifications?lang=${lang}&pageSize=${pageSize}&pageNumber=${pageNumber}`
  )
}

export const deleteNotificationsAPI = notificationId => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}`)
}

export const getCountOfUnreadNotiAPI = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/notifications/unread-count`)
}
//#endregion

//#region  * Roles

export const getRolesAPI = (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/roles?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const createRolesAPI = (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/roles`, data, { xScreenId, xFeatureId })
}

export const updateRolesAPI = (roleId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/roles/${roleId}`, data, { xScreenId, xFeatureId })
}

export const deleteRolesAPI = (roleId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/roles/${roleId}`, { xScreenId, xFeatureId })
}

export const getRolesDetailAPI = (roleId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/roles/${roleId}`, { xScreenId, xFeatureId })
}

export const updateRolesEnableAPI = (roleId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/roles/${roleId}/set-enabled`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region  USER ACCOUNTS API

export const getUserAccountsAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/employees?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const getAllUserAccountsAPI = async (keyword, xScreenId = 0, xFeatureId = 0) => {
  let arr = []
  let i = 0
  do {
    i = i + 1
    const data = await getUserAccountsAPI(100, i, keyword, xScreenId, xFeatureId)
    arr = [...arr, ...data.data.pageData]
    if (data.data.pageData.length === 0) {
      i = 0
    }
  } while (i !== 0)
  return arr
}

export const getUserAccountByIdAPI = async (employeeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/employees/${employeeId}`, { xScreenId, xFeatureId })
}

export const inviteUserAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/employees/invite`, data, { xScreenId, xFeatureId })
}

export const updateUserAccountAPI = async (employeeId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/employees/${employeeId}`, data, { xScreenId, xFeatureId })
}

export const deleteUserAccountAPI = async (employeeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/employees/${employeeId}`, { xScreenId, xFeatureId })
}

export const updateUserEnableAPI = async (employeeId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/employees/${employeeId}/set-enabled`, data, {
    xScreenId,
    xFeatureId
  })
}

export const resetUserPasswordAPI = async (employeeId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/employees/${employeeId}/change-password`, data, {
    xScreenId,
    xFeatureId
  })
}

export const getUserPermissionAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/employees/my-permissions`)
}

export const reinviteUserAPI = async (employeeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/employees/${employeeId}/re-invite`, {
    xScreenId,
    xFeatureId
  })
}

export const changeClinicOwnerAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinics/change-owner`, data, {
    xScreenId,
    xFeatureId
  })
}
//#endregion

//#region  * Groups

export const getUserGroupsAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/user-groups?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const createUserGroupAPI = (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/user-groups`, data, { xScreenId, xFeatureId })
}

export const updateUserGroupAPI = (userGroupId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/user-groups/${userGroupId}`, data, { xScreenId, xFeatureId })
}

export const deleteUserGroupAPI = (userGroupId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/user-groups/${userGroupId}`, { xScreenId, xFeatureId })
}

export const updateUserGroupEnableAPI = (userGroupId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/user-groups/${userGroupId}/set-enabled`, data, {
    xScreenId,
    xFeatureId
  })
}

export const getUserGroupDetailAPI = (userGroupId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/user-groups/${userGroupId}`, { xScreenId, xFeatureId })
}
//#endregion

//#region  * Upload Image

export const createPhysicalFileAPI = async data => {
  return axios.post(`${process.env.REACT_APP_API_URL}/files/request-upload-image`, data)
}

export const putUploadImageAPI = async (preSignedURL, data) => {
  return axios.put(`${preSignedURL}`, data, {
    __auth: false,
    upload: data.type
  })
}

export const putUploadDoneAPI = async fileId => {
  return axios.put(`${process.env.REACT_APP_API_URL}/files/${fileId}/upload-done`)
}
//#endregion

//#region  * Properties

export const getPropertiesAPI = async (entityTypeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/properties?entityTypeId=${entityTypeId}`, {
    xScreenId,
    xFeatureId
  })
}

export const createPropertyAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/properties`, data, { xScreenId, xFeatureId })
}

export const updatePropertyAPI = async (propertyId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/properties/${propertyId}`, data, { xScreenId, xFeatureId })
}

export const getPropertyByIdAPI = async (propertyId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/properties/${propertyId}`, { xScreenId, xFeatureId })
}

export const deletePropertyAPI = async (propertyId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/properties/${propertyId}`, { xScreenId, xFeatureId })
}
//#endregion

// #region *Forms

export const getFormsAPI = async (pageSize, pageNumber, entityTypeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/forms?pageSize=${pageSize}&pageNumber=${pageNumber}&entityTypeId=${entityTypeId}`,
    {
      xScreenId,
      xFeatureId
    }
  )
}

export const createFormAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/forms`, data, { xScreenId, xFeatureId })
}

export const updateFormAPI = async (formId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/forms/${formId}`, data, { xScreenId, xFeatureId })
}

export const getFormByIdAPI = async (formId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/forms/${formId}`, { xScreenId, xFeatureId })
}

export const deleteFormAPI = async (formId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/forms/${formId}`, { xScreenId, xFeatureId })
}

export const updateEnableFormAPI = async (formId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/forms/${formId}/set-enabled`, data, { xScreenId, xFeatureId })
}

export const getAllFormsByEntityTypeAPI = async (entityTypeId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/forms/all-by-entity-type?entityTypeId=${entityTypeId}`, {
    xScreenId,
    xFeatureId
  })
}

export const getFormPropertiesAPI = async (formId, xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/forms/${formId}/properties`, { xScreenId, xFeatureId })
}

export const getPrintTemplatesAPI = async (xScreenId = 0, xFeatureId = 0) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinics/print-templates`, { xScreenId, xFeatureId })
}
// #endregion

//#region  * Medicines

export const getMedicinesAPI = async (pageSize, pageNumber, keyword = '', xScreenId = 0, xFeatureId = 0) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/medicines?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${encodeURI(
      keyword
    )}`,
    { xScreenId, xFeatureId }
  )
}

export const getAllMedicinesAPI = async (keyword, xScreenId = 0, xFeatureId = 0) => {
  let arr = []
  let i = 0
  do {
    i = i + 1
    const data = await getMedicinesAPI(100, i, keyword, xScreenId, xFeatureId)
    arr = [...arr, ...data.data.pageData]
    if (data.data.pageData.length === 0) {
      i = 0
    }
  } while (i !== 0)
  return arr
}

export const createMedicineAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/medicines`, data, { xScreenId, xFeatureId })
}

export const deleteMedicineAPI = async (medicineId, xScreenId = 0, xFeatureId = 0) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/medicines/${medicineId}`, { xScreenId, xFeatureId })
}

export const updateMedicineAPI = async (medicineId, data, xScreenId = 0, xFeatureId = 0) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/medicines/${medicineId}`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region *ResultSheet

export const createResultSheetAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/result-sheets`, data, { xScreenId, xFeatureId })
}
//#endregion

//#region *Prescription

export const createPrescriptionAPI = async (data, xScreenId = 0, xFeatureId = 0) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/prescriptions`, data, { xScreenId, xFeatureId })
}
//#endregion
