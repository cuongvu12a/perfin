import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Input, FormGroup, Col, Row } from 'reactstrap'

import FormError from '@components/FormError'
import Switch from '@components/Switch'
import NumberInput from '@components/NumberInput'

const SettingsLocationTab = ({ register, errors, isValid, control, isEditable }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.settings' defaultMessage='Settings' />
      </h3>
      <Row className='mt-2'>
        <Col sm='6'>
          <FormGroup>
            <Label for='minPrice'>
              <FormattedMessage id='label.minPrice' defaultMessage='Min Price' />
            </Label>
            <NumberInput
              id='minPrice'
              name='minPriceInVnd'
              invalid={errors.minPriceInVnd && !isValid && true}
              control={control}
              suffix='VND'
              options={{ numeralDecimalScale: 0 }}
              disabled={!isEditable}
            />
            {errors && errors.minPriceInVnd && !isValid && <FormError>{errors.minPriceInVnd.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='maxPrice'>
              <FormattedMessage id='label.maxPrice' defaultMessage='Max Price' />
            </Label>
            <NumberInput
              id='maxPrice'
              name='maxPriceInVnd'
              invalid={errors.maxPriceInVnd && !isValid && true}
              control={control}
              suffix='VND'
              options={{
                numeralDecimalScale: 0
              }}
              disabled={!isEditable}
            />
            {errors && errors.maxPriceInVnd && !isValid && <FormError>{errors.maxPriceInVnd.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='healthDeclarationUrl'>
              <FormattedMessage id='label.healthDeclarationUrl' defaultMessage='Health declaration link' />
            </Label>
            <Input
              id='healthDeclarationUrl'
              name='healthDeclarationUrl'
              invalid={errors.healthDeclarationUrl && true}
              innerRef={register()}
              disabled={!isEditable}
            />
            {errors && errors.healthDeclarationUrl && <FormError>{errors.healthDeclarationUrl.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='isVisibleForBooking'>
              <FormattedMessage id='label.isVisibleForBooking' defaultMessage='Visible For Booking' />
            </Label>
            <br />
            <Switch name='isVisibleForBooking' control={control} disabled={!isEditable} />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default SettingsLocationTab
