import { Controller } from 'react-hook-form'
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.vn'
import classnames from 'classnames'

const NumberInput = ({ control, name, invalid, prefix, suffix, options, ...rest }) => {
  const defaultOptions = {
    numeral: true,
    numeralDecimalScale: 2,
    numeralDecimalMark: '.',
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ','
  }

  return (
    <InputGroup
      className={classnames('input-group-merge', {
        'is-invalid': invalid
      })}
    >
      {prefix && (
        <InputGroupAddon addonType='prepend'>
          <InputGroupText
            className={classnames({
              'border-danger': invalid
            })}
          >
            {prefix}
          </InputGroupText>
        </InputGroupAddon>
      )}
      <Controller
        control={control}
        name={name}
        render={({ onChange, onBlur, value }) => (
          <Cleave
            onChange={e => {
              onChange(e.target.rawValue)
            }}
            onBlur={onBlur}
            value={value}
            className='form-control'
            options={{ ...defaultOptions, ...options }}
            {...rest}
          />
        )}
      />
      {suffix && (
        <InputGroupAddon addonType='append'>
          <InputGroupText
            className={classnames({
              'border-danger': invalid
            })}
          >
            {suffix}
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export default NumberInput
