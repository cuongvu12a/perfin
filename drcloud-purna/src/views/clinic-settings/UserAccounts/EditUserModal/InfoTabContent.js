import React from 'react'
import { Label, Input, FormGroup, Row, Col } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import FormError from '@components/FormError'
import Select from '@components/Select'
import PhoneInput from '@components/PhoneInput'
import { CityEnum, CountryEnum } from '@utility/constants'
import { enumToSelectOptions } from '@utility/utils'

const InfoTabContent = ({ register, errors, isEditable, control }) => {
  return (
    <>
      <h2>
        <FormattedMessage id='title.information' defaultMessage='Information' />
      </h2>
      <Row>
        <Col sm='12'>
          <FormGroup>
            <Label for='phoneNumber'>
              <FormattedMessage id='label.phoneNumber' defaultMessage='Phone Number' />
            </Label>
            <PhoneInput
              id='phoneNumber'
              name='phoneNumber'
              autoFocus
              disabled={!isEditable}
              control={control}
              invalid={!!errors && !!errors.phoneNumber}
            />
            {errors && errors.phoneNumber && <FormError>{errors.phoneNumber.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='address'>
              <FormattedMessage id='label.address' defaultMessage='Address' />
            </Label>
            <Input
              id='address'
              name='address'
              invalid={errors.address && true}
              innerRef={register()}
              disabled={!isEditable}
            />
            {errors && errors.address && <FormError>{errors.address.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='city'>
              <FormattedMessage id='label.city' defaultMessage='City' />
            </Label>
            <Select
              name='cityId'
              control={control}
              options={enumToSelectOptions(CityEnum)}
              isClearable={false}
              isDisabled={!isEditable}
              getOptionLabel={option => <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />}
            />
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='country'>
              <FormattedMessage id='label.country' defaultMessage='Country' />
            </Label>
            <Select
              name='countryId'
              control={control}
              options={enumToSelectOptions(CountryEnum)}
              isClearable={false}
              isDisabled={!isEditable}
              getOptionLabel={option => <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  )
}

export default InfoTabContent
