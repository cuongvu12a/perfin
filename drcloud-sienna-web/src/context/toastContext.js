import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext(Promise.reject);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toastOptions, setToastOptions] = useState(null);

  const openToast = (options) => {
    setToastOptions(options);
  };

  const handleClose = () => {
    if (toastOptions.onClose) {
      toastOptions.onClose();
    }
    setToastOptions(null);
  };

  return (
    <>
      <ToastContext.Provider value={openToast}>{children}</ToastContext.Provider>

      <Snackbar open={Boolean(toastOptions)} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={toastOptions?.type || 'success'} sx={{ width: '100%' }}>
          {toastOptions?.message || ''}
        </Alert>
      </Snackbar>
    </>
  );
};
