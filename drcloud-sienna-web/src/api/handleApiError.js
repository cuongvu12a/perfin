// Known error code
export const ERROR_CODES = {
  NEED_VERIFY_ACCOUNT: 'PINT_17',
  INVALID_EMAIL_OR_PASSWORD: 'PINT_44'
};

// All api error
export const API_ERRORS = {
  PINT_17: {
    message: 'You need to verify your account'
  }
};

export const getErrorMessage = (error, defaultMessage = '') => {
  if (error?.response?.metadata) {
    const { metadata } = error.response;
    for (let i = 0; i < metadata.messages.length; i++) {
      if (API_ERRORS[metadata.messages[i].code] !== undefined) {
        const e = API_ERRORS[metadata.messages[i].code];
        if (e.getMessage) {
          return e.getMessage(error.response);
        }
        return e.message;
      }
      return `${metadata.messages[i].code} - ${metadata.messages[i].value}`;
    }
  }
  return error.message || defaultMessage;
};

export const hasError = (error, errorCode) => {
  return !!error?.response?.metadata?.messages?.find((msg) => msg.code === errorCode);
};
