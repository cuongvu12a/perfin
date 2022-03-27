import { useState, Fragment, useMemo } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Label, FormGroup } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { selectThemeColors } from '@utility/utils'
import { changeAppointmentDoctorAPI } from '@api/main'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const InProgressChangeDoctorModal = ({ appointmentInfo, handleError403, close, open, handleNextAppointment }) => {
  const clinicData = useSelector(state => state.auth.clinicData)
  const [doctors, setDoctors] = useState(clinicData.doctors)
  const [specialtyId, setSpecialtyId] = useState(null)
  const [doctor, setDoctor] = useState(appointmentInfo.doctor.doctorId)

  const handleSpecialtyChanged = value => {
    setSpecialtyId(value?.specialtyId)
    if (value) {
      const filteredDoctors = clinicData.doctors.filter(d => d.specialtyId === value.specialtyId)

      setDoctors(filteredDoctors)
      setDoctor(filteredDoctors.length > 0 ? filteredDoctors[0].doctorId : null)
    } else {
      setDoctors(clinicData.doctors)
      setDoctor(appointmentInfo.doctor.doctorId)
    }
  }

  const handleDoctorChanged = value => {
    setDoctor(value.doctorId)
  }

  const isAllowedSubmit = useMemo(() => {
    return !!doctor
  }, [doctor])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await changeAppointmentDoctorAPI(appointmentInfo.appointmentId, { doctorId: doctor }, xScreenId)
      handleNextAppointment('CONTINUE')
      close()
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
      <Modal
        isOpen={open}
        autoFocus={false}
        backdrop='static'
        toggle={close}
        className='modal-dialog-centered'
        key='changeDoctorModal'
        id='change-doctor-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            <h2>
              <FormattedMessage id='title.changeDoctor' defaultMessage='Change Doctor' />
            </h2>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='specialty'>
                <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
              </Label>
              <Select
                autoFocus
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                maxMenuHeight={150}
                isClearable={true}
                placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                getOptionLabel={op => op.specialtyName}
                getOptionValue={op => op.specialtyId}
                value={clinicData.specialties.find(op => op.specialtyId === specialtyId) || null}
                options={clinicData.specialties}
                onChange={handleSpecialtyChanged}
              />
            </FormGroup>

            <FormGroup className='mt-2'>
              <Label for='doctor'>
                <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                menuPlacement='top'
                maxMenuHeight='120px'
                isClearable={false}
                getOptionLabel={op => op.doctorName}
                getOptionValue={op => op.doctorId}
                value={doctors.find(op => op.doctorId === doctor) || null}
                options={doctors}
                onChange={handleDoctorChanged}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='secondary' outline onClick={() => close()}>
              <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
            </Button>
            <Button
              color='primary'
              type='submit'
              onClick={handleSubmit}
              disabled={!isAllowedSubmit || doctor === appointmentInfo.doctor.doctorId}
            >
              <FormattedMessage id='button.save' defaultMessage='Save' />
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}
export default InProgressChangeDoctorModal
