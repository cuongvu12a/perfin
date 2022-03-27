import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'
import { useIntl } from 'react-intl'

import { selectThemeColors } from '@utility/utils'

const Select = ({ control, name, options, menuPlacement, maxMenuHeight, isClearable, ...rest }) => {
  const intl = useIntl()

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value, ref }) => (
        <ReactSelect
          theme={selectThemeColors}
          className='react-select'
          classNamePrefix='select'
          menuPlacement={menuPlacement}
          maxMenuHeight={maxMenuHeight}
          inputRef={ref}
          value={options?.find(c => c.value === value) || null}
          onChange={val => onChange(val ? val.value : null)}
          options={options}
          defaultValue={options && !isClearable ? options[0] : null}
          isClearable={isClearable}
          {...rest}
        />
      )}
    />
  )
}

export default Select
