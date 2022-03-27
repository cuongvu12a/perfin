import Flatpickr from 'react-flatpickr'

import '@core/scss/react/libs/flatpickr/flatpickr.scss'
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import { X } from 'react-feather'

const DateTimePicker = ({ value, onChange, isClearable, ...rest }) => {
  return (
    <InputGroup className='input-group-merge'>
      <Flatpickr
        value={value}
        id='date-time-picker'
        className='form-control'
        onChange={date => onChange(date)}
        {...rest}
      />
      {!!value && !!isClearable ? (
        <InputGroupAddon addonType='append'>
          <InputGroupText
            className='btn'
            onClick={e => {
              onChange('')
            }}
          >
            <X size={14} />
          </InputGroupText>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}

export default DateTimePicker
