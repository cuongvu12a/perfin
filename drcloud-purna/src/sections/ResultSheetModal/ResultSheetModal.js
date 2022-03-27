import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { format } from 'date-fns'
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Button, Card, CardBody } from 'reactstrap'
import * as Icon from 'react-feather'

import Toast from '@utility/toast'
import { GenderEnum } from '@utility/constants'
import { reverseEnumObject } from '@utility/utils'
import { getAppointmentDetailById, getPrescriptionDetailByAppointmentId, getClinicAppointmentByIdAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import ResultContent from '@components/ResultContent'
import AvatarWrapper from '@components/AvatarWrapper'

const ResultSheetModal = ({ appointment, handleOpenResultSheet }) => {
  const { appointmentId } = appointment || {}
  const intl = useIntl()

  const [appointmentDetail, setAppointmentDetail] = useState(null)
  useEffect(async () => {
    try {
      if (!appointmentId || appointmentId === appointmentDetail?.appointmentId) return

      const clinicAppointmentAwait = getClinicAppointmentByIdAPI(appointmentId)
      const appointmentAwait = getAppointmentDetailById(appointmentId)
      const prescriptionAwait = getPrescriptionDetailByAppointmentId(appointmentId)
      const [clinicAppointment, appointment, prescription] = await Promise.all([
        clinicAppointmentAwait,
        appointmentAwait,
        prescriptionAwait
      ])

      setAppointmentDetail({ ...appointment, ...clinicAppointment.data, ...appointment.data, ...prescription.data })
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [appointmentId])

  const handlerPrinter = () => {
    console.log('Printer')
  }

  const handleClose = () => {
    if (!!handleOpenResultSheet) {
      handleOpenResultSheet(null)
    }
  }

  return (
    <>
      {!!appointmentDetail && (
        <Modal isOpen={!!appointmentId} toggle={handleClose} className='modal-dialog-centered modal-lg result-sheet'>
          <ModalHeader tag='h1' cssModule={{ 'modal-title': 'w-100' }}>
            <Row className='justify-content-between align-items-center'>
              <Col>
                <FormattedMessage id='title.resultSheet' defaultMessage='Result Sheet' />
              </Col>
              <Col className='text-right'>
                <span>{format(appointmentDetail.reExaminationDateUnix || 0, 'dd/MM/yyyy - HH:mm')}</span>
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <Card className='card-action'>
              <CardBody className='d-flex justify-content-between align-items-center py-1'>
                <AvatarWrapper
                  imgUrl={appointmentDetail.patient.avatar?.fileUrl}
                  title={appointmentDetail.patient.fullName}
                  subTitle={`${intl.formatMessage({
                    id: `enum.${reverseEnumObject(GenderEnum)[appointmentDetail.patient.gender || GenderEnum.Male]}`
                  })} - ${new Date(appointmentDetail.patient.birthdayUnix).getFullYear()}`}
                  size='lg'
                  subTitleColor='muted'
                />
                <small className='text-muted'>{intl.formatMessage({ id: `label.patient` })}</small>
              </CardBody>
            </Card>
            <Card className='card-action'>
              <CardBody className='d-flex justify-content-between align-items-center py-1'>
                <AvatarWrapper
                  imgUrl={appointmentDetail?.doctor?.avatar?.fileUrl}
                  title={appointmentDetail?.doctor?.doctorName}
                  subTitle={appointmentDetail?.locationName}
                  size='lg'
                  subTitleColor='muted'
                />
                <small className='text-muted'>{intl.formatMessage({ id: `label.doctor` })}</small>
              </CardBody>
            </Card>
            <ResultContent resultReviewData={appointmentDetail} />
          </ModalBody>
          <ModalFooter className='align-items-stretch'>
            <Button color='primary' onClick={handlerPrinter}>
              <FormattedMessage id='button.print' defaultMessage='View' />
              <Icon.Printer size={14} className='ml-50' />
            </Button>
            <Button color='primary' outline onClick={handleClose}>
              <FormattedMessage id='button.close' defaultMessage='Close' />
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  )
}

export default ResultSheetModal
