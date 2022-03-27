import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Input, FormGroup, Col, Row } from 'reactstrap'

import FormError from '@components/FormError'
import PhoneInput from '@components/PhoneInput'
import NumberInput from '@components/NumberInput'
import Select from '@components/Select'
import { enumToSelectOptions } from '@utility/utils'
import { CityEnum, CountryEnum, KeyBoardEnum } from '@utility/constants'

const GeneralLocationTab = ({ register, toggleTab, errors, control, isEditable }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.general' defaultMessage='General' />
      </h3>
      <Row className='mt-2'>
        <Col sm='12'>
          <FormGroup>
            <Label for='name'>
              <FormattedMessage id='label.locationName' defaultMessage='Location Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='name'
              name='locationName'
              autoFocus
              invalid={errors.locationName && true}
              innerRef={register()}
              disabled={!isEditable}
            />
            {errors && errors.locationName && <FormError>{errors.locationName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='phoneNumber'>
              <FormattedMessage id='label.phoneNumber' defaultMessage='Phone number' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <PhoneInput
              name='phoneNumber'
              control={control}
              invalid={!!errors && !!errors.phoneNumber}
              disabled={!isEditable}
            />
            {errors && errors.phoneNumber && <FormError>{errors.phoneNumber.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='address'>
              <FormattedMessage id='label.address' defaultMessage='Address' />
              <span className='text-danger'>&nbsp;*</span>
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
            <Label for='longitude'>
              <FormattedMessage id='label.longitude' defaultMessage='Longitude' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <NumberInput
              id='longitude'
              name='longitude'
              invalid={errors.longitude && true}
              control={control}
              options={{ numeralDecimalScale: 7 }}
              disabled={!isEditable}
            />
            {errors && errors.longitude && <FormError>{errors.longitude.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='latitude'>
              <FormattedMessage id='label.latitude' defaultMessage='Latitude' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <NumberInput
              id='latitude'
              name='latitude'
              invalid={errors.latitude && true}
              control={control}
              options={{ numeralDecimalScale: 7 }}
              disabled={!isEditable}
            />
            {errors && errors.latitude && <FormError>{errors.latitude.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='province'>
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
              getOptionLabel={option => <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('settings')
                }
              }}
              isDisabled={!isEditable}
            />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default GeneralLocationTab
