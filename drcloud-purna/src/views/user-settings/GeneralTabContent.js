import React, { Fragment } from 'react'
import { Label, Row, Col, Input, FormGroup } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import FormError from '@components/FormError'
import { KeyBoardEnum, PhysicalFileTypeEnum } from '@utility/constants'
import UploadAvatar from '@sections/UploadAvatar'
import { Controller } from 'react-hook-form'

const GeneralTabs = ({ register, toggleTab, errors, avatar, control }) => {
  return (
    <Fragment>
      <h2>
        <FormattedMessage id='title.generalSettings' defaultMessage='General Settings' />
      </h2>
      <Controller
        name='avatarFileId'
        control={control}
        render={({ onChange }) => (
          <UploadAvatar physicalFileType={PhysicalFileTypeEnum.Avatar} image={avatar?.fileUrl} setFileId={onChange} />
        )}
      />

      <Row className='mt-2'>
        <Col sm='6'>
          <FormGroup>
            <Label for='firstName'>
              <FormattedMessage id='label.firstName' defaultMessage='First Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input id='firstName' name='firstName' autoFocus innerRef={register()} invalid={errors.firstName && true} />
            {errors && errors.firstName && <FormError>{errors.firstName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='lastName'>
              <FormattedMessage id='label.lastName' defaultMessage='Last Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='lastName'
              name='lastName'
              innerRef={register()}
              invalid={errors.lastName && true}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('information')
                }
              }}
            />
            {errors && errors.lastName && <FormError>{errors.lastName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='email'>
              <FormattedMessage id='label.email' defaultMessage='Email' />
            </Label>
            <Input type='email' id='email' name='email' innerRef={register()} disabled />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default GeneralTabs
