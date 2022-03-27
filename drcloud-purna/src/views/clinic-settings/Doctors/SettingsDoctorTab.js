import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Input, FormGroup, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { HelpCircle } from 'react-feather'

import FormError from '@components/FormError'
import Switch from '@components/Switch'
import { KeyBoardEnum } from '@utility/constants'

const SettingsDoctorTab = ({ register, errors, isEditable, toggleTab, control }) => {
  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.settings' defaultMessage='Settings' />
      </h3>
      <Row className='mt-2'>
        <Col sm='6'>
          <FormGroup>
            <Label for='timePerAppointmentInMinutes'>
              <FormattedMessage id='label.timePerAppointmentInMinutes' defaultMessage='Time per slot' />
            </Label>
            <Input
              id='timePerAppointmentInMinutes'
              name='timePerAppointmentInMinutes'
              type='number'
              invalid={errors.timePerAppointmentInMinutes && true}
              innerRef={register({ valueAsNumber: true })}
              disabled={!isEditable}
            />
            {errors && errors.timePerAppointmentInMinutes && (
              <FormError>{errors.timePerAppointmentInMinutes.message}</FormError>
            )}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='waitingTime'>
              <FormattedMessage id='label.waitingTime' defaultMessage='Waiting Time' />
            </Label>
            <Input
              id='waitingTime'
              name='bufferTimePerAppointmentInMinutes'
              type='number'
              invalid={errors.bufferTimePerAppointmentInMinutes && true}
              innerRef={register({ valueAsNumber: true })}
              className='mt-40'
              disabled={!isEditable}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('profile')
                }
              }}
            />
            {errors && errors.bufferTimePerAppointmentInMinutes && (
              <FormError>{errors.bufferTimePerAppointmentInMinutes.message}</FormError>
            )}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <div className='d-flex align-items-center mb-25'>
              <Label className='mb-0' for='numberOfAppointmentsPerSlot'>
                <FormattedMessage
                  id='label.numberOfAppointmentsPerSlot'
                  defaultMessage='Number of appointments per slot'
                />
              </Label>
              <div className='ml-50'>
                <HelpCircle size='16' id='toolTip' />
                <UncontrolledTooltip placement='top' target='toolTip'>
                  <FormattedMessage id='doctorSettings.numberOfAppointmentsPerSlotTooltip' defaultMessage='Allow multiple patients booking in one slot' />
                </UncontrolledTooltip>
              </div>
            </div>
            <Input
              id='numberOfAppointmentsPerSlot'
              name='numberOfAppointmentsPerSlot'
              type='number'
              invalid={errors.numberOfAppointmentsPerSlot && true}
              innerRef={register({ valueAsNumber: true })}
              disabled={!isEditable}
            />
            {errors && errors.numberOfAppointmentsPerSlot && (
              <FormError>{errors.numberOfAppointmentsPerSlot.message}</FormError>
            )}
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
        <Col sm='12'>
          <FormGroup>
            <Label for='isAutoApproveAppointment'>
              <FormattedMessage id='label.isAutoApproveAppointment' defaultMessage='Auto Approve Appointment' />
            </Label>
            <br />
            <Switch name='isAutoApproveAppointment' control={control} disabled={!isEditable} />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default SettingsDoctorTab
