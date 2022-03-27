import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Row, Col, Input, FormGroup } from 'reactstrap'

import FormError from '@components/FormError'
import Select from '@components/Select'
import PhoneInput from '@components/PhoneInput'
import { arrayToSelectOptions } from '@utility/utils'
import { KeyBoardEnum, PhysicalFileTypeEnum } from '@utility/constants'
import UploadAvatar from '@sections/UploadAvatar'
import { Controller } from 'react-hook-form'

const GeneralDoctorTab = ({ register, errors, isEditable, toggleTab, control, specialties, avatar }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.general' defaultMessage='General' />
      </h3>

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
            <Label for='doctorName'>
              <FormattedMessage id='label.doctorName' defaultMessage='Doctor Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='doctorName'
              name='doctorName'
              autoFocus
              innerRef={register()}
              invalid={errors.doctorName && true}
              disabled={!isEditable}
            />
            {errors && errors.doctorName && <FormError>{errors.doctorName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='specialty'>
              <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
            </Label>
            <Select
              id='specialty'
              name='specialtyId'
              control={control}
              options={arrayToSelectOptions(specialties, 'specialtyName', 'specialtyId')}
              maxMenuHeight={150}
              isClearable={true}
              isDisabled={!isEditable}
            />
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='doctorClinicCode'>
              <FormattedMessage id='label.doctorCode' defaultMessage='Doctor Code' />
            </Label>
            <Input
              id='doctorClinicCode'
              name='doctorClinicCode'
              innerRef={register()}
              invalid={errors.doctorClinicCode && true}
              disabled={!isEditable}
            />
            {errors && errors.doctorClinicCode && <FormError>{errors.doctorClinicCode.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='phoneNumber'>
              <FormattedMessage id='label.phoneNumber' defaultMessage='Phone Number' />
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
        <Col sm='6'>
          <FormGroup>
            <Label for='email'>
              <FormattedMessage id='label.email' defaultMessage='Email' />
            </Label>
            <Input
              id='email'
              name='email'
              invalid={errors.email && true}
              innerRef={register()}
              disabled={!isEditable}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('settings')
                }
              }}
            />
            {errors && errors.email && <FormError>{errors.email.message}</FormError>}
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default GeneralDoctorTab
