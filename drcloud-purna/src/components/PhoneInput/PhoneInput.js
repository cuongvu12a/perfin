import { Controller } from 'react-hook-form'
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.vn'
import classnames from 'classnames'

const PhoneInput = ({ control, name, invalid, ...rest }) => {
  return (
    <InputGroup
      className={classnames('input-group-merge', {
        'is-invalid': invalid
      })}
    >
      <InputGroupAddon addonType='prepend'>
        <InputGroupText
          className={classnames({
            'border-danger': invalid
          })}
        >
          VN(+84)
        </InputGroupText>
      </InputGroupAddon>
      <Controller
        control={control}
        name={name}
        render={({ onChange, onBlur, value, ref }) => (
          <Cleave
            onChange={e => onChange(e.target.rawValue)}
            onBlur={onBlur}
            value={value}
            className='form-control'
            options={{ phone: true, phoneRegionCode: 'VN' }}
            {...rest}
          />
        )}
      />
    </InputGroup>
  )
}

export default PhoneInput
