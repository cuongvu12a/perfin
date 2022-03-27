import { Fragment, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Form,
  CustomInput
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { getMedicalRecordAPI, updateMedicalRecordAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'

import { GenderEnum, FrontEndScreenEnum } from '@utility/constants'
import Toast from '@utility/toast'
import FormError from '@components/FormError'
import DatePicker from '@components/DatePicker'
import UILoader from '@core/components/ui-loader'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.MedicalRecords

const EditMedicalRecord = ({ open, close, handleError403, patient }) => {
  const defaultValues = {
    gender: GenderEnum.Male,
    birthdayUnix: new Date('1990-01-01'),
    heightInCm: 0,
    weightInKg: 0,
    medicalHistory: '',
    allergy: ''
  }

  const editMedicalRecordSchema = yup.object().shape({
    birthdayUnix: yup.date().required(),
    gender: yup.number().required(),
    heightInCm: yup.number().min(0),
    weightInKg: yup.number().min(0),
    medicalHistory: yup.string().trim(),
    allergy: yup.string().trim()
  })

  const { register, handleSubmit, formState, control, reset, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(editMedicalRecordSchema),
    defaultValues
  })

  useEffect(async () => {
    try {
      const patientRes = await getMedicalRecordAPI(patient.clinicPatientId, xScreenId)

      reset({
        ...defaultValues,
        ...{
          gender: patientRes.data.gender,
          birthdayUnix: new Date(patientRes.data.birthdayUnix),
          heightInCm: patientRes.data.heightInCm,
          weightInKg: patientRes.data.weightInKg,
          medicalHistory: patientRes.data.medicalHistory,
          allergy: patientRes.data.allergy
        }
      })
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [patient.clinicPatientId, reset])

  const onSubmit = async data => {
    try {
      data.birthdayUnix = data.birthdayUnix.getTime()
      await updateMedicalRecordAPI(patient.clinicPatientId, data, xScreenId)
      Toast.showSuccess('toast.success')
      close('SAVED')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const closeModal = () => {
    close()
    reset()
  }

  const handleSubmitForm = () => formState.isValid && !formState.isSubmitting && handleSubmit(onSubmit)()

  return (
    <Fragment>
      <Modal
        isOpen={open}
        autoFocus={false}
        toggle={close}
        backdrop='static'
        className='modal-dialog-centered modal-edit-schedule'
        key='EditPatientModal'
        id='edit-patient-modal'
      >
        <Form>
          <ModalHeader tag='h2' toggle={() => closeModal()}>
            <div className='text-truncate' style={{ width: '400px' }}>
              {patient.fullName}
            </div>
          </ModalHeader>
          <UILoader blocking={false}>
            <ModalBody>
              <FormGroup>
                <Label for='birthdayUnix'>
                  <FormattedMessage id='label.birthday' defaultMessage='Date of birth' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  control={control}
                  name='birthdayUnix'
                  render={({ onChange, value }) => <DatePicker id='date' value={value} onChange={onChange} />}
                />
              </FormGroup>
              <FormGroup tag='fieldset'>
                <Label for='gender'>
                  <FormattedMessage id='label.gender' defaultMessage='Gender' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  name='gender'
                  control={control}
                  render={({ onChange, value }) => (
                    <FormGroup className='d-flex mt-50'>
                      <CustomInput
                        type='radio'
                        id='male'
                        className='mr-2'
                        checked={value === GenderEnum.Male}
                        onChange={e => {
                          if (e.target.checked) {
                            onChange(GenderEnum.Male)
                          }
                        }}
                        label={<FormattedMessage id='enum.Male' defaultMessage='Male' />}
                      />

                      <CustomInput
                        type='radio'
                        id='female'
                        checked={value === GenderEnum.Female}
                        onChange={e => {
                          if (e.target.checked) {
                            onChange(GenderEnum.Female)
                          }
                        }}
                        label={<FormattedMessage id='enum.Female' defaultMessage='Female' />}
                      />
                    </FormGroup>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label for='heightInCm'>
                  <FormattedMessage id='label.heightInCm' defaultMessage='Height In Cm' />
                </Label>
                <Input
                  id='heightInCm'
                  name='heightInCm'
                  type='number'
                  innerRef={register({ valueAsNumber: true })}
                  invalid={errors.heightInCm && true}
                />
                {errors && errors.heightInCm && <FormError>{errors.heightInCm.message}</FormError>}
              </FormGroup>
              <FormGroup>
                <Label for='weightInKg'>
                  <FormattedMessage id='label.weightInKg' defaultMessage='Weight In Kg' />
                </Label>
                <Input
                  id='weightInKg'
                  name='weightInKg'
                  type='number'
                  innerRef={register({ valueAsNumber: true })}
                  invalid={errors.weightInKg && true}
                />
                {errors && errors.weightInKg && <FormError>{errors.weightInKg.message}</FormError>}
              </FormGroup>

              <FormGroup>
                <Label for='medicalHistory'>
                  <FormattedMessage id='label.medicalHistory' defaultMessage='Medical History' />
                </Label>
                <TextArea
                  name='medicalHistory'
                  id='medicalHistory'
                  innerRef={register()}
                  handleSubmit={handleSubmitForm}
                />
              </FormGroup>

              <FormGroup>
                <Label for='allergy'>
                  <FormattedMessage id='label.allergy' defaultMessage='Allergy' />
                </Label>
                <TextArea name='allergy' id='allergy' innerRef={register()} handleSubmit={handleSubmitForm} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              {!formState.isDirty && (
                <Button color='secondary' outline onClick={() => close()}>
                  <FormattedMessage id='button.close' defaultMessage='Close' />
                </Button>
              )}
              {formState.isDirty && (
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
          </UILoader>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default EditMedicalRecord
