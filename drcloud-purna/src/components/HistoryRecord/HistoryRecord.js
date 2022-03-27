import React, { useState } from 'react'
import { format } from 'date-fns'
import { MoreHorizontal } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { AppointmentStatusDisplayConfig } from '@utility/constants'
import { Col, Row, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown } from 'reactstrap'

const HistoryRecord = ({ isMedicalRecordMode, record, handleOpenResultSheet }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <>
      <div className='mb-1'>
        <Row>
          <Col sm='8'>
            <h4>
              {format(
                isMedicalRecordMode ? record.actualStartDatetimeUnix : record.startDatetimeUnix,
                'dd/MM/yyyy - HH:mm'
              )}
            </h4>
          </Col>
          <Col sm='4' className='text-right'>
            <UncontrolledButtonDropdown
              className='btn-icon ml-auto'
              direction='down'
              isOpen={dropdownOpen}
              toggle={toggle}
            >
              <DropdownToggle className='p-0' color='white'>
                <MoreHorizontal color='darkgrey' size={24} />
              </DropdownToggle>
              <DropdownMenu>
                {isMedicalRecordMode ? (
                  <DropdownItem
                    tag='span'
                    onClick={() => {
                      if (!!handleOpenResultSheet) {
                        handleOpenResultSheet(record)
                      }
                    }}
                  >
                    <FormattedMessage id='button.viewResultSheet' defaultMessage='View Result Sheet' />
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag={Link}
                    to={`/appointments/details?appointmentId=${record.appointmentId}`}
                    onClick={() => {}}
                  >
                    <span className='align-middle'>
                      <FormattedMessage id='title.viewAppointmentDetails' defaultMessage='View Appointments Details' />
                    </span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </Col>
        </Row>
        <div>
          <Row>
            <Col sm='4'>
              <h6 className='font-weight-normal text-secondary mb-25'>
                <FormattedMessage id='label.locationName' defaultMessage='Location Name' />
              </h6>
            </Col>
            <Col sm='8'>
              <h6 className='font-weight-normal text-body text-truncate mb-25'>{record.locationName}</h6>
            </Col>
          </Row>
          <Row>
            <Col sm='4'>
              <h6 className='font-weight-normal text-secondary mb-25'>
                <FormattedMessage id='label.doctorName' defaultMessage='Doctor Name' />
              </h6>
            </Col>
            <Col sm='8'>
              <h6 className='font-weight-normal text-body text-truncate mb-25'>{record.doctorName}</h6>
            </Col>
          </Row>
          {isMedicalRecordMode ? (
            <>
              <Row>
                <Col sm='4'>
                  <h6 className='font-weight-normal text-secondary mb-25'>
                    <FormattedMessage id='label.symptom' defaultMessage='symptom' />
                  </h6>
                </Col>
                <Col sm='8'>
                  <h6 className='font-weight-normal text-body text-truncate mb-25'>{record.symptom}</h6>
                </Col>
              </Row>
              <Row>
                <Col sm='4'>
                  <h6 className='font-weight-normal text-secondary mb-25'>
                    <FormattedMessage id='label.result' defaultMessage='Result' />
                  </h6>
                </Col>
                <Col sm='8'>
                  <h6 className='font-weight-normal text-body text-truncate mb-25'>{record.result}</h6>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <Col sm='4'>
                  <h6 className='font-weight-normal text-secondary mb-25'>
                    <FormattedMessage id='label.status' defaultMessage='Status' />
                  </h6>
                </Col>
                <Col sm='8'>
                  <h6 className='font-weight-normal text-body text-truncate mb-25'>
                    <FormattedMessage
                      id={`enum.${AppointmentStatusDisplayConfig[record.appointmentStatusId]?.title}`}
                      defaultMessage={`${AppointmentStatusDisplayConfig[record.appointmentStatusId]?.title}`}
                    />
                  </h6>
                </Col>
              </Row>
            </>
          )}
        </div>
        <hr className='mt-0 mb-50 border-top-1' />
      </div>
    </>
  )
}

export default HistoryRecord
