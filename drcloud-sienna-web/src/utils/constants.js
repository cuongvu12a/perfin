export const TransactionStatusEnum = {
  WaitForPayment: 1000,
  PaymentProcessing: 3000,
  Success: 5000,
  Canceled: 9000,
  Error: 9999
};

export const TransactionStatusStyle = {
  1000: {
    label: 'Wait for payment',
    color: 'warning'
  },
  3000: {
    label: 'Payment processing',
    color: 'warning'
  },
  5000: {
    label: 'Success',
    color: 'success'
  },
  9000: {
    label: 'Canceled',
    color: 'warning'
  },
  9999: {
    label: 'Error',
    color: 'error'
  }
};

export const BookingStepId = {
  welcome: 'welcome',
  selectClinic: 'selectClinic',
  selectPatient: 'selectPatient',
  createPatient: 'createPatient',
  createAppointment: 'createAppointment',
  confirmAppointment: 'confirmAppointment',
  success: 'success'
};

export const createPatient = 'createPatient';

export const GenderEnum = {
  Nam: 0,
  Nữ: 1
};

export const CurrencyUnitEnum = {
  VND: 'VND'
};

export const CountryEnum = {
  'Việt Nam': 192,
  Other: 0
};

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const SpecialtyDefault = {
  specialtyId: 'all',
  specialtyName: 'Tất cả'
};
