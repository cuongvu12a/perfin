import { CustomInput } from 'reactstrap'
import { Controller } from 'react-hook-form'

const Switch = ({ name, control, activeLabel, deactiveLabel, ...rest }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => (
        <div className='d-flex align-items-center'>
          {value && activeLabel && <div className='mr-50'>{activeLabel}</div>}
          {!value && deactiveLabel && <div className='mr-50'>{deactiveLabel}</div>}
          <CustomInput
            id={name}
            type='switch'
            className='custom-control-success'
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
            {...rest}
          />
        </div>
      )}
    />
  )
}

export default Switch
