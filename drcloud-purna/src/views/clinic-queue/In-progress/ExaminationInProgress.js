import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { CornerUpLeft, Trash2, UserPlus } from 'react-feather'

import { FrontEndScreenEnum, FrontEndFeatureEnum, ScreenEnum } from '@utility/constants'
import useQuery from '@hooks/useQuery'
import {
  finishAppointmentAPI,
  createResultSheetAPI,
  createPrescriptionAPI,
  getClinicAppointmentByIdAPI,
  getNextAppointmentAPI,
  cancelAppointmentAPI,
  startAppointmentAPI
} from '@api/main'
import withAuthorization from '@hoc/withAuthorization'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import { reverseMedicineObject, reversePropertyObject } from '@utility/utils'
import Dialog from '@utility/dialog'

import SidebarLeft from './SidebarLeft'
import RightSideComponent from './RightSideComponent'
import InProgressChangeDoctorModal from './InProgressChangeDoctorModal'
import AvatarWrapper from '@components/AvatarWrapper'

// ** Styles
import '@core/scss/react/apps/app-calendar.scss'
import UILoader from '@core/components/ui-loader'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const ExaminationInProgress = ({ handleError403 }) => {
  const query = useQuery()
  const history = useHistory()
  const appointmentId = query.get('appointmentId')
  const intl = useIntl()

  const [isLoading, setIsLoading] = useState(false)
  const [appointmentDetail, setAppointmentDetail] = useState()
  const [nextAppointment, setNextAppointment] = useState()
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [changeDoctorModalOpen, setChangeDoctorModalOpen] = useState(false)
  const [examinationResultData, setExaminationResultData] = useState()
  const [prescriptionData, setPrescriptionData] = useState()

  const convertExaminationData = () => {
    if (!!examinationResultData && appointmentDetail) {
      const properties = reversePropertyObject(examinationResultData.properties)
      return {
        appointmentId: appointmentDetail.appointmentId,
        formId: examinationResultData.formId,
        symptom: examinationResultData.symptom,
        result: examinationResultData.result,
        reExaminationDate: examinationResultData.reExaminationDate,
        properties
      }
    }
  }

  const convertPrescriptionData = () => {
    if (!!prescriptionData && appointmentDetail && prescriptionData.medicines.length > 0) {
      const medicines = reverseMedicineObject(prescriptionData.medicines)

      return {
        appointmentId: appointmentDetail.appointmentId,
        note: prescriptionData.note,
        medicines
      }
    }
  }

  useEffect(async () => {
    try {
      setIsLoading(true)
      setNextAppointment()
      const res = await getClinicAppointmentByIdAPI(appointmentId, xScreenId)
      setAppointmentDetail(res.data)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }, [refreshToggle, appointmentId])

  const handleStepFinal = async () => {
    try {
      if (!!appointmentDetail.doctor.doctorId) {
        const res = await getNextAppointmentAPI(appointmentDetail.doctor.doctorId, xScreenId)
        if (!!res.data) {
          setNextAppointment(res.data)
        }
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const handleBackToQueue = async (isClickBackToQueue = false) => {
    if (!!isClickBackToQueue) {
      const dialogResult = await Dialog.showQuestion({
        title: intl.formatMessage({ id: 'dialog.backToQueueTitle' }),
        text: intl.formatMessage({ id: 'dialog.backToQueueMessage' })
      })
      if (!dialogResult.isConfirmed) return
    }
    history.push('/clinic-queue')
  }

  const handleNextAppointment = async mode => {
    try {
      const next = await getNextAppointmentAPI(appointmentDetail.doctor.doctorId, xScreenId)
      if (mode === 'CONTINUE' && !!next.data) {
        await startAppointmentAPI(next.data.appointmentId, xScreenId, FrontEndFeatureEnum.StartFinishAppointment)
        history.push({
          pathname: '/clinic-queue/in-progress',
          search: `?appointmentId=${next.data.appointmentId}`
        })
        window.location.reload(false)
      } else {
        handleBackToQueue()
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const handleFinish = async mode => {
    try {
      const dataExaminationStep = convertExaminationData()
      const dataPrescriptionStep = convertPrescriptionData()

      // console.log('exam', dataExaminationStep)
      // console.log('prescription', dataPrescriptionStep)

      await createResultSheetAPI(dataExaminationStep, xScreenId)
      if (!!dataPrescriptionStep) {
        await createPrescriptionAPI(dataPrescriptionStep, xScreenId)
      }
      await finishAppointmentAPI(appointmentDetail.appointmentId, xScreenId, FrontEndFeatureEnum.StartFinishAppointment)
      handleNextAppointment(mode)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const handleCancelAppointment = async () => {
    try {
      const dialogResult = await Dialog.showInputText({
        title: intl.formatMessage({ id: 'dialog.cancelAppointmentTitle' }),
        text: intl.formatMessage({ id: 'dialog.cancelAppointmentMessage' }),
        inputLabel: intl.formatMessage({ id: 'dialog.cancelAppointmentLabel' }),
        handleValidate: value => !value && intl.formatMessage({ id: 'dialog.inputDialogRequire' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      await cancelAppointmentAPI(
        { appointmentIds: [appointmentDetail.appointmentId], cancelReason: dialogResult.value },
        xScreenId,
        FrontEndFeatureEnum.CancelAppointment
      )
      Toast.showSuccess('toast.success')
      handleBackToQueue()
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  return (
    <Fragment>
      <UILoader blocking={isLoading}>
        <div className='content-header d-flex justify-content-between row mb-2 px-1'>
          <div className='d-flex'>
            <h2 className='content-header-title float-left mb-0'>
              <FormattedMessage id='title.inProgress' defaultMessage='In-Progress' />
            </h2>
            <div className='ml-1'>
              <AvatarWrapper
                imgUrl={null}
                title={appointmentDetail?.doctor.doctorName}
                subTitle={appointmentDetail?.locationName}
              />
            </div>
          </div>
          <UncontrolledButtonDropdown>
            <DropdownToggle outline color='primary' size='sm' caret className='bg-white'>
              <FormattedMessage id='button.actions' defaultMessage='Actions' />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag='a' onClick={() => setChangeDoctorModalOpen(true)} disabled={false}>
                <UserPlus className='mr-50' size={15} />
                <span className='align-middle'>
                  <FormattedMessage id='button.changeDoctor' defaultMessage='Change Doctor' />
                </span>
              </DropdownItem>

              <DropdownItem tag='a' onClick={() => handleBackToQueue(true)} disabled={false}>
                <CornerUpLeft className='mr-50' size={15} />
                <span className='align-middle'>
                  <FormattedMessage id='button.backToQueue' defaultMessage='Back to Queue' />
                </span>
              </DropdownItem>

              <DropdownItem tag='a' onClick={() => handleCancelAppointment()} disabled={false}>
                <Trash2 className='mr-50' size={15} />
                <span className='align-middle'>
                  <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
        <div className='app-calendar mb-0 in-progress-component'>
          <Row noGutters>
            <Col className='col mr-1 flex-grow-0 d-flex flex-column'>
              <SidebarLeft
                appointmentDetail={appointmentDetail}
                nextAppointment={nextAppointment}
                handleError403={handleError403}
              />
            </Col>

            <Col className='position-relative'>
              {appointmentDetail && (
                <RightSideComponent
                  appointmentDetail={appointmentDetail}
                  resultReviewData={{ ...examinationResultData, ...prescriptionData }}
                  handleError403={handleError403}
                  setExaminationResultData={setExaminationResultData}
                  setPrescriptionData={setPrescriptionData}
                  handleFinish={handleFinish}
                  setNextAppointment={setNextAppointment}
                  handleStepFinal={handleStepFinal}
                />
              )}
            </Col>
          </Row>
        </div>
        {appointmentDetail && (
          <InProgressChangeDoctorModal
            appointmentInfo={appointmentDetail}
            handleError403={handleError403}
            close={() => setChangeDoctorModalOpen(false)}
            handleNextAppointment={handleNextAppointment}
            open={changeDoctorModalOpen}
          />
        )}
      </UILoader>
    </Fragment>
  )
}

export default withAuthorization(ExaminationInProgress, ScreenEnum[FrontEndScreenEnum.TodayExaminations])
