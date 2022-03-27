import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, FormGroup, Input, Label, Row } from 'reactstrap'

import FormError from '@components/FormError'
import Select from '@components/Select'
import { arrayToSelectOptions, enumToSelectOptions } from '@utility/utils'
import { EntityTypeEnum, KeyBoardEnum } from '@utility/constants'

const SettingsTab = ({ control, register, errors, isEditable, toggleTab, form, printTemplateList }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.general' defaultMessage='General' />
      </h3>
      <Row className='mt-2'>
        <Col sm='12'>
          <FormGroup>
            <Label for='entityTypeId'>
              <FormattedMessage id='label.formEntity' defaultMessage='Form Entity' />
            </Label>
            <Select
              name='entityTypeId'
              id='entityTypeId'
              autoFocus
              options={enumToSelectOptions(EntityTypeEnum)}
              getOptionLabel={option => <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />}
              control={control}
              isDisabled={!!form || !isEditable}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='12'>
          <FormGroup>
            <Label for='formName'>
              <FormattedMessage id='label.formName' defaultMessage='Form Name' />
            </Label>
            <span className='text-danger'>&nbsp;*</span>

            <Input
              id='formName'
              name='formName'
              invalid={errors.formName && true}
              innerRef={register()}
              disabled={!isEditable}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('properties')
                }
              }}
            />
            {errors && errors.formName && <FormError>{errors.formName.message}</FormError>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='12'>
          <FormGroup>
            <Label for='printTemplateId'>
              <FormattedMessage id='label.printingTemplate' defaultMessage='Printing Template' />
            </Label>
            <Select
              name='printTemplateId'
              id='printTemplateId'
              options={arrayToSelectOptions(printTemplateList, 'templateName', 'templateId')}
              control={control}
              isDisabled={!isEditable}
            />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default SettingsTab
