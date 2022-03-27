import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Input, FormGroup, Col, Row } from 'reactstrap'

import FormError from '@components/FormError'
import TextArea from '@components/TextArea'

const ProfileDoctorTab = ({ register, errors, isEditable, handleSubmit }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.profile' defaultMessage='Profile' />
      </h3>
      <Row className='mt-2'>
        <Col sm='6'>
          <FormGroup>
            <Label for='yearsOfExperience'>
              <FormattedMessage id='label.yearsOfExperience' defaultMessage='Years Of Experience' />
            </Label>
            <Input
              id='yearsOfExperience'
              name='yearsOfExperience'
              type='number'
              invalid={errors.yearsOfExperience && true}
              innerRef={register({ valueAsNumber: true })}
              disabled={!isEditable}
            />
            {errors && errors.yearsOfExperience && <FormError>{errors.yearsOfExperience.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='introduction'>
              <FormattedMessage id='label.introduction' defaultMessage='Introduction' />
            </Label>
            <TextArea
              id='introduction'
              name='introduction'
              invalid={errors.introduction && true}
              innerRef={register()}
              disabled={!isEditable}
              handleSubmit={handleSubmit}
            />
            {errors && errors.introduction && <FormError>{errors.introduction.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='workExperience'>
              <FormattedMessage id='label.workExperience' defaultMessage='Work Experience' />
            </Label>
            <TextArea
              id='workExperience'
              name='workExperience'
              invalid={errors.workExperience && true}
              innerRef={register()}
              disabled={!isEditable}
              handleSubmit={handleSubmit}
            />
            {errors && errors.workExperience && <FormError>{errors.workExperience.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='certificates'>
              <FormattedMessage id='label.certificates' defaultMessage='Certificates' />
            </Label>
            <TextArea
              id='certificates'
              name='certificates'
              rows={3}
              invalid={errors.certificates && true}
              innerRef={register()}
              disabled={!isEditable}
              handleSubmit={handleSubmit}
            />
            {errors && errors.certificates && <FormError>{errors.certificates.message}</FormError>}
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ProfileDoctorTab
