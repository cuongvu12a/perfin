import { Fragment } from 'react'
import { toast, Slide } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { Bell, Check, X, AlertTriangle, Info } from 'react-feather'
import Avatar from '@core/components/avatar'

const ToastConfig = {
  transition: Slide,
  position: toast.POSITION.BOTTOM_LEFT,
  hideProgressBar: true
}

const DefaultToast = ({ title, message }) => (
  <Fragment>
    <div className={`toastify-header ${!message && 'pb-0'}`}>
      <div className='title-wrapper'>
        <Avatar size='sm' color='primary' icon={<Bell size={12} />} />
        <h6 className='toast-title'>
          <FormattedMessage id={title} defaultMessage={title} />
        </h6>
      </div>
    </div>
    {message && (
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          <FormattedMessage id={message} defaultMessage={message} />
        </span>
      </div>
    )}
  </Fragment>
)

const SuccessToast = ({ title, message }) => (
  <Fragment>
    <div className={`toastify-header ${!message && 'pb-0'}`}>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Check size={12} />} />
        <h6 className='toast-title'>
          <FormattedMessage id={title} defaultMessage={title} />
        </h6>
      </div>
    </div>
    {message && (
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          <FormattedMessage id={message} defaultMessage={message} />
        </span>
      </div>
    )}
  </Fragment>
)

const WarningToast = ({ title, message }) => (
  <Fragment>
    <div className={`toastify-header ${!message && 'pb-0'}`}>
      <div className='title-wrapper'>
        <Avatar size='sm' color='warning' icon={<X size={12} />} />
        <h6 className='toast-title'>
          <FormattedMessage id={title} defaultMessage={title} />
        </h6>
      </div>
    </div>
    {message && (
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          <FormattedMessage id={message} defaultMessage={message} />
        </span>
      </div>
    )}
  </Fragment>
)

const ErrorToast = ({ title, message }) => (
  <Fragment>
    <div className={`toastify-header ${!message && 'pb-0'}`}>
      <div className='title-wrapper'>
        <Avatar size='sm' color='warning' icon={<AlertTriangle size={12} />} />
        <h6 className='toast-title'>
          <FormattedMessage id={title} defaultMessage={title} />
        </h6>
      </div>
    </div>
    {message && (
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text' className='toastify-error-text'>
          <FormattedMessage
            id={message}
            defaultMessage={`Unknown error, please contact technical supporter (${message})`}
          />
        </span>
      </div>
    )}
  </Fragment>
)

const InfoToast = ({ title, message }) => (
  <Fragment>
    <div className={`toastify-header ${!message && 'pb-0'}`}>
      <div className='title-wrapper'>
        <Avatar size='sm' color='info' icon={<Info size={12} />} />
        <h6 className='toast-title'>
          <FormattedMessage id={title} defaultMessage={title} />
        </h6>
      </div>
    </div>
    {message && (
      <div className='toastify-body'>
        <span role='img' aria-label='toast-text'>
          <FormattedMessage id={message} defaultMessage={message} />
        </span>
      </div>
    )}
  </Fragment>
)

const Toast = {}

Toast.showDefault = (title, message) => {
  toast(<DefaultToast title={title} message={message} />, ToastConfig)
}

Toast.showSuccess = (title, message) => {
  toast.success(<SuccessToast title={title} message={message} />, ToastConfig)
}

Toast.showError = (title, message) => {
  toast.error(<ErrorToast title={title} message={message} />, ToastConfig)
}

Toast.showWarning = (title, message) => {
  toast.warning(<WarningToast title={title} message={message} />, ToastConfig)
}

Toast.showInfo = (title, message) => {
  toast.info(<InfoToast title={title} message={message} />, ToastConfig)
}

export default Toast
