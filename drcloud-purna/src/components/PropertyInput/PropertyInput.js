import React from 'react'
import { Controller } from 'react-hook-form'
import { FormGroup, Input, Label } from 'reactstrap'

import DateTimePicker from '@components/DateTimePicker'
import Select from '@components/Select'
import { PropertyValueTypeEnum } from '@utility/constants'

const PropertyInput = ({ prop, control, ...rest }) => {
  return (
    <FormGroup>
      <Label className='form-label text-truncate w-100' for={prop.porpertyId}>
        {prop.propertyName}
      </Label>
      {prop.propertyValueTypeId === PropertyValueTypeEnum.FreeText && (
        <Controller
          name={`${prop.propertyId}`}
          control={control}
          render={({ onChange, value }) => <Input value={value || ''} onChange={e => onChange(e.target.value)} />}
        />
      )}
      {prop.propertyValueTypeId === PropertyValueTypeEnum.ListOfOptions && prop.propertyValueTypeDetail.listOfOptions && (
        <Select
          name={`${prop.propertyId}`}
          control={control}
          options={prop.propertyValueTypeDetail.listOfOptions.map(op => {
            return {
              label: op,
              value: op
            }
          })}
        />
      )}
      {prop.propertyValueTypeId === PropertyValueTypeEnum.Date && (
        <Controller
          control={control}
          name={`${prop.propertyId}`}
          render={({ onChange, value }) => (
            <DateTimePicker
              id={`${prop.propertyId}`}
              value={value ? new Date(value) : ''}
              onChange={val => onChange(new Date(val).getTime())}
              isClearable={true}
            />
          )}
        />
      )}
      {prop.propertyValueTypeId === PropertyValueTypeEnum.DateTime && (
        <Controller
          control={control}
          name={`${prop.propertyId}`}
          render={({ onChange, value }) => (
            <DateTimePicker
              id={`${prop.propertyId}`}
              value={value ? new Date(value) : ''}
              onChange={val => onChange(new Date(val).getTime())}
              isClearable={true}
              data-enable-time
            />
          )}
        />
      )}
    </FormGroup>
  )
}

export default PropertyInput
