import axios from './base';

export const getUserInfoAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/users/me`);
};

export const authLoginToken = (loginToken) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-in-with-mb`, { loginToken });
};

export const searchClinics = async (
  params = {
    keyword: '',
    longitude: 0,
    latitude: 0
  }
) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinics/search`, { params });
};

export const getPatients = async (
  params = {
    pageSize: 20,
    pageNumber: 0
  }
) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/patients`, { params });
};

export const createPatient = async (payload) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/patients`, payload);
};

export const getClinicInfo = async (clinicId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/clinics/${clinicId}/info-for-booking`);
};

export const getDoctorInfo = async (
  clinicId,
  payload = {
    doctorId: ''
  }
) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinics/${clinicId}/get-doctor-for-booking`, payload);
};

export const getDoctorSchedule = async (
  clinicId,
  payload = {
    doctorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    locationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  }
) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/clinics/${clinicId}/get-doctor-schedule`, payload);
};

export const createAppointment = async (
  payload = {
    patientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    locationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    doctorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    scheduleId: 0,
    startDatetimeUnix: 0,
    symptom: 'string'
  }
) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/appointments`, payload);
};
