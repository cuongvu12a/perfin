import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage } from 'react-intl'

const MySwal = withReactContent(Swal)

const Dialog = {}

Dialog.showInfo = ({ title, text, confirmButtonText, ...rest }) => {
  return MySwal.fire({
    title,
    html: text,
    allowOutsideClick: false,
    showConfirmButton: true,
    confirmButtonText: confirmButtonText || 'OK',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
    ...rest
  })
}

Dialog.showQuestion = ({ title, text, confirmButtonText, cancelButtonText, ...rest }) => {
  return MySwal.fire({
    title,
    html: text,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || 'OK',
    cancelButtonText: cancelButtonText || 'Cancel',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-secondary ml-1'
    },
    buttonsStyling: false,
    ...rest
  })
}

Dialog.showDanger = ({ title, text, confirmButtonText, cancelButtonText, ...rest }) => {
  return MySwal.fire({
    title,
    html: text,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || 'OK',
    cancelButtonText: cancelButtonText || 'Cancel',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-outline-secondary ml-1'
    },
    buttonsStyling: false,
    ...rest
  })
}

Dialog.showInputText = ({ title, text, label, handleValidate, confirmButtonText, cancelButtonText, ...rest }) => {
  return MySwal.fire({
    title,
    html: text,
    input: 'text',
    inputValidator: handleValidate,
    inputLabel: label,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || 'OK',
    cancelButtonText: cancelButtonText || 'Cancel',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-secondary ml-1',
      input: 'cancel-dialog-input',
      validationMessage: 'cancel-dialog-validate-message'
    },
    buttonsStyling: false,
    ...rest
  })
}

Dialog.showRadioInput = ({ title, text, options, confirmButtonText, cancelButtonText, ...rest }) => {
  return MySwal.fire({
    title,
    input: 'radio',
    inputOptions: options,
    inputValue: Object.keys(options)[0],
    html: text,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || 'OK',
    cancelButtonText: cancelButtonText || 'Cancel',
    showClass: {
      popup: 'animate__animated animate__fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-secondary ml-1',
      input: 'row d-flex justify-content-start'
    },
    buttonsStyling: false,
    ...rest
  })
}

export default Dialog
