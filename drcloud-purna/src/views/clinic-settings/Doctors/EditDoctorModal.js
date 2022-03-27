import { useState, useEffect, Fragment, useMemo } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Form
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import Dialog from '@utility/dialog'
import Toast from '@utility/toast'
import { createDoctorAPI, getAllSpecialtyAPI, getDoctorByIdAPI, updateDoctorAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import Switch from '@components/Switch'
import Tabs from './Tabs'
import GeneralDoctorTab from './GeneralDoctorTab'
import SettingsDoctorTab from './SettingsDoctorTab'
import ProfileDoctorTab from './ProfileDoctorTab'
import { FrontEndScreenEnum } from '@utility/constants'
import defaultAvatar from '@assets/images/avatar-blank.png'

const xScreenId = FrontEndScreenEnum.Doctors

const EditDoctorModal = ({ open, doctor, isEditable, close, handleError403 }) => {
  const intl = useIntl()

  const EditDoctorSchema = yup.object().shape({
    doctorClinicCode: yup.string().max(128).trim(),
    doctorName: yup.string().max(128).required().trim(),
    phoneNumber: yup.string().max(16),
    email: yup.string().email().max(128).trim(),
    yearsOfExperience: yup.number().min(0),
    introduction: yup.string().max(256).trim(),
    workExperience: yup.string().max(256).trim(),
    certificates: yup.string().max(256).trim(),
    timePerAppointmentInMinutes: yup.number().required().min(0),
    bufferTimePerAppointmentInMinutes: yup.number().required().min(0),
    numberOfAppointmentsPerSlot: yup.number().required().min(1)
  })

  const defaultValues = {
    doctorClinicCode: '',
    doctorName: '',
    phoneNumber: '',
    email: '',
    yearsOfExperience: 1,
    introduction: '',
    workExperience: '',
    certificates: '',
    specialtyId: null,
    timePerAppointmentInMinutes: 15,
    bufferTimePerAppointmentInMinutes: 5,
    numberOfAppointmentsPerSlot: 1,
    isAutoApproveAppointment: false,
    isVisibleForBooking: true,
    avatarFileId: null
  }

  const { register, handleSubmit, formState, errors, control, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditDoctorSchema),
    defaultValues
  })

  const [activeTab, setActiveTab] = useState('general')
  const [specialties, setSpecialties] = useState()
  const [avatar, setAvatar] = useState(null)

  useEffect(async () => {
    try {
      const data = await getAllSpecialtyAPI(xScreenId)
      setSpecialties(data)
      if (doctor) {
        const res = await getDoctorByIdAPI(doctor.doctorId, xScreenId)
        setAvatar(res.data?.avatar || { fileUrl: defaultAvatar })
        reset({
          ...defaultValues,
          ...{
            doctorClinicCode: res.data.doctorClinicCode,
            doctorName: res.data.doctorName,
            phoneNumber: res.data.phoneNumber,
            email: res.data.email,
            yearsOfExperience: res.data.yearsOfExperience || 0,
            introduction: res.data.introduction,
            workExperience: res.data.workExperience,
            certificates: res.data.certificates,
            specialtyId: res.data.specialtyId || null,
            timePerAppointmentInMinutes: res.data.timePerAppointmentInMinutes,
            bufferTimePerAppointmentInMinutes: res.data.bufferTimePerAppointmentInMinutes,
            isAutoApproveAppointment: res.data.isAutoApproveAppointment,
            isVisibleForBooking: res.data.isVisibleForBooking,
            numberOfAppointmentsPerSlot: res.data.numberOfAppointmentsPerSlot,
            isEnabled: res.data.isEnabled,
            avatarFileId: res.data?.avatar?.physicalFileId || null
          }
        })
      } else {
        const firstSpecialtyId = data[0]?.specialtyId
        reset({ ...defaultValues, ...{ specialtyId: firstSpecialtyId } })
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [doctor, reset])

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const onSubmit = async data => {
    try {
      if (doctor) {
        if (
          formState.dirtyFields.bufferTimePerAppointmentInMinutes === true ||
          formState.dirtyFields.timePerAppointmentInMinutes === true ||
          formState.dirtyFields.numberOfAppointmentsPerSlot === true
        ) {
          const dialogResult = await Dialog.showQuestion({
            title: intl.formatMessage({ id: 'dialog.editingTimeDoctorTitle' }),
            text: intl.formatMessage({ id: 'dialog.editingTimeDoctorMessage' }, { name: doctor.doctorName }),
            confirmButtonText: intl.formatMessage({ id: 'button.ok' }),
            cancelButtonText: intl.formatMessage({ id: 'button.cancel' }),
            width: '640'
          })
          if (!dialogResult.isConfirmed) {
            return
          }
        }
        await updateDoctorAPI(doctor.doctorId, data, xScreenId)
      } else {
        await createDoctorAPI(data, xScreenId)
      }

      Toast.showSuccess('toast.success')
      close('SAVED')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={open}
        toggle={close}
        autoFocus={false}
        backdrop='static'
        className='modal-dialog-centered modal-md'
        key='EditLocationsModal'
        id='edit-locations-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {doctor ? (
              <>
                <h2>{doctor.doctorName}</h2>
                <Switch
                  activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                  deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                  name='isEnabled'
                  disabled={!isEditable}
                  control={control}
                />
              </>
            ) : (
              <h2>
                <FormattedMessage id='title.addDoctor' defaultMessage='Adding Doctor' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-2 mb-md-0' md='3'>
                <Tabs activeTab={activeTab} toggleTab={toggleTab} />
              </Col>
              <Col md='9'>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='general'>
                        <GeneralDoctorTab
                          register={register}
                          errors={errors}
                          isEditable={isEditable}
                          toggleTab={toggleTab}
                          control={control}
                          specialties={specialties}
                          avatar={avatar}
                        />
                      </TabPane>
                      <TabPane tabId='settings'>
                        <SettingsDoctorTab
                          register={register}
                          errors={errors}
                          isEditable={isEditable}
                          toggleTab={toggleTab}
                          control={control}
                        />
                      </TabPane>
                      <TabPane tabId='profile'>
                        <ProfileDoctorTab
                          register={register}
                          errors={errors}
                          isEditable={isEditable}
                          control={control}
                          handleSubmit={() => formState.isValid 
                            && !formState.isSubmitting 
                            && handleSubmit(onSubmit)()}
                        />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {(!formState.isDirty || !isEditable) && (
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}

            {formState.isDirty && isEditable && (
              <>
                <Button color='secondary' outline onClick={() => close()}>
                  <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  onClick={handleSubmit(onSubmit)}
                  disabled={!formState.isValid || formState.isSubmitting}
                >
                  <FormattedMessage id='button.save' defaultMessage='Save' />
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}
export default EditDoctorModal
