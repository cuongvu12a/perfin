import React, { useState } from 'react'
import { MapPin, MoreHorizontal, Clipboard } from 'react-feather'
import { FormattedMessage, useIntl } from 'react-intl'
import { DropdownItem, Badge, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap'
import { format } from 'date-fns'

import { reverseEnumObject } from '@utility/utils'
import { AppointmentStatusEnum, GenderEnum } from '@utility/constants'
import { Can } from '@utility/context/Can'
import AvatarWrapper from '@components/AvatarWrapper'

const AppointmentCard = ({ appointment, onActionClick, isExaminationAccess }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const intl = useIntl()
  const toggle = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className='appointment-card'>
      <div className='appointment-card-row-first'>
        <AvatarWrapper
          imgUrl={appointment.patient.avatar?.fileUrl}
          title={appointment.patient.fullName}
          subTitle={`${intl.formatMessage({
            id: `enum.${reverseEnumObject(GenderEnum)[appointment.patient.gender || GenderEnum.Male]}`
          })} - ${new Date(appointment.patient.birthdayUnix).getFullYear()}`}
        />
        <Badge
          className='appointment-badge'
          color={
            appointment.appointmentStatusId === AppointmentStatusEnum.InProgress
              ? 'success'
              : `${
                  appointment.appointmentStatusId === AppointmentStatusEnum.Finished
                    ? 'light-info'
                    : `${
                        appointment.scheduleId && appointment.actualCheckInDatetimeUnix < appointment.startDatetimeUnix
                          ? 'primary'
                          : 'warning'
                      }`
                }`
          }
        >
          <span>
            {format(
              !!appointment.scheduleId ? appointment.startDatetimeUnix : appointment.actualCheckInDatetimeUnix,
              'HH:mm'
            )}
          </span>
        </Badge>
      </div>
      <div className='appointment-card-row'>
        <Clipboard size={16} />
        <span className='ml-50 font-weight-bold'>{appointment.doctorName}</span>
      </div>
      <div className='appointment-card-row mb-0'>
        <MapPin size={16} />
        <span className='ml-50'>{appointment.locationName}</span>
        <Can I={'write' || 'startFinish' || 'cancel'} a={'todayExaminations'}>
          <UncontrolledButtonDropdown
            className='btn-icon ml-auto'
            direction='left'
            isOpen={dropdownOpen}
            toggle={toggle}
          >
            <DropdownToggle className='p-0' color='white'>
              <MoreHorizontal color='darkgrey' size={24} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag='a'
                onClick={() => onActionClick('change-doctor')}
                disabled={
                  !(
                    appointment.appointmentStatusId === AppointmentStatusEnum.CheckedIn ||
                    appointment.appointmentStatusId === AppointmentStatusEnum.InProgress
                  )
                }
              >
                <FormattedMessage id='button.changeDoctor' defaultMessage='Change Doctor' />
              </DropdownItem>
              <Can I={'write' || 'startFinish'} a={'todayExaminations'}>
                <DropdownItem
                  tag='a'
                  onClick={() => onActionClick('start')}
                  disabled={
                    appointment.appointmentStatusId === AppointmentStatusEnum.Finished ||
                    (appointment.appointmentStatusId === AppointmentStatusEnum.InProgress && !isExaminationAccess)
                  }
                >
                  <FormattedMessage id='button.start' defaultMessage='Start' />
                </DropdownItem>
                <DropdownItem
                  tag='a'
                  onClick={() => onActionClick('finish')}
                  disabled={appointment.appointmentStatusId !== AppointmentStatusEnum.InProgress}
                >
                  <FormattedMessage id='button.finish' defaultMessage='Finish' />
                </DropdownItem>
              </Can>

              <Can I={'write' || 'cancel'} a={'todayExaminations'}>
                <DropdownItem
                  tag='a'
                  onClick={() => onActionClick('cancel')}
                  disabled={appointment.appointmentStatusId === AppointmentStatusEnum.Finished}
                >
                  <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                </DropdownItem>
              </Can>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </Can>
      </div>
    </div>
  )
}

export default React.memo(AppointmentCard)
