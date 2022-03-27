import Flatpickr from 'react-flatpickr'

import '@core/scss/react/libs/flatpickr/flatpickr.scss'

const TimePicker = ({ value, onChange, ...rest }) => {
  return (
    <Flatpickr
      className='form-control'
      options={{
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true
      }}
      value={value}
      onChange={val => onChange(val[0])}
      {...rest}
    />
  )
}

export default TimePicker
