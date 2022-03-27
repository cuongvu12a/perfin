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

import { createClinicPatientAPI, getClinicPatientByIdAPI, updateClinicPatientAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'

import { GenderEnum, CountryEnum, FrontEndScreenEnum } from '@utility/constants'
import { enumToSelectOptions } from '@utility/utils'
import Toast from '@utility/toast'
import Select from '@components/Select'
import FormError from '@components/FormError'
import PhoneInput from '@components/PhoneInput'
import DatePicker from '@components/DatePicker'
import UILoader from '@core/components/ui-loader'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.Contacts 

const EditContactInfoModal = ({ open, close, handleError403, clinicPatientId }) => {
  const defaultValues = {
    fullName: '',
    phoneNumber: null,
    address: '',
    gender: GenderEnum.Male,
    birthdayUnix: new Date('1990-01-01'),
    countryId: CountryEnum.Vietnam,
    email: '',
    heightInCm: 0,
    weightInKg: 0,
    medicalHistory: '',
    allergy: ''
  }

  const editContactInfoSchema = yup.object().shape({
    fullName: yup.string().required().max(128).trim(),
    birthdayUnix: yup.date().required(),
    phoneNumber: yup.string().required().max(16),
    email: yup.string().email(),
    address: yup.string().required().max(128).trim(),
    gender: yup.number().required(),
    heightInCm: yup.number().min(0),
    weightInKg: yup.number().min(0),
    medicalHistory: yup.string().trim(),
    allergy: yup.string().trim()
  })

  const { register, handleSubmit, formState, control, reset, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(editContactInfoSchema),
    defaultValues
  })

  useEffect(async () => {
    try {
      if (clinicPatientId) {
        const patientRes = await getClinicPatientByIdAPI(clinicPatientId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            fullName: patientRes.data.fullName,
            phoneNumber: patientRes.data.phoneNumber,
            address: patientRes.data.address,
            gender: patientRes.data.gender,
            birthdayUnix: new Date(patientRes.data.birthdayUnix),
            countryId: patientRes.data.countryId,
            email: patientRes.data.email,
            heightInCm: patientRes.data.heightInCm,
            weightInKg: patientRes.data.weightInKg,
            medicalHistory: patientRes.data.medicalHistory,
            allergy: patientRes.data.allergy
          }
        })
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [clinicPatientId, reset])

  const onSubmit = async data => {
    try {
      data.birthdayUnix = data.birthdayUnix.getTime()
      if (clinicPatientId) {
        await updateClinicPatientAPI(clinicPatientId, data, xScreenId)
      } else {
        await createClinicPatientAPI(data, xScreenId)
      }
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
        className='modal-dialog-centered modal-md modal-edit-schedule'
        key='EditPatientModal'
        id='edit-patient-modal'
      >
        <Form>
          <ModalHeader tag='h2' toggle={() => closeModal()}>
            {!clinicPatientId ? (
              <FormattedMessage id='title.addingPatient' defaultMessage='Adding Patient' />
            ) : (
              <FormattedMessage id='title.editingPatient' defaultMessage='Editing Patient' />
            )}
          </ModalHeader>
          <UILoader blocking={false}>
            <ModalBody>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='fullName'>
                      <FormattedMessage id='label.fullName' defaultMessage='Full name' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Input
                      id='fullName'
                      name='fullName'
                      autoFocus
                      innerRef={register()}
                      invalid={errors.fullName && true}
                    />
                    {errors && errors.fullName && <FormError>{errors.fullName.message}</FormError>}
                  </FormGroup>
                </Col>

                <Col sm='6'>
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
                </Col>
              </Row>

              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='phoneNumber'>
                      <FormattedMessage id='label.phoneNumber' defaultMessage='Phone number' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <PhoneInput name='phoneNumber' control={control} invalid={!!errors && !!errors.phoneNumber} />
                    {errors && errors.phoneNumber && <FormError>{errors.phoneNumber.message}</FormError>}
                  </FormGroup>
                </Col>

                <Col sm='6'>
                  <FormGroup>
                    <Label for='address'>
                      <FormattedMessage id='label.address' defaultMessage='Address' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Input id='address' name='address' innerRef={register()} invalid={errors.address && true} />
                    {errors && errors.address && <FormError>{errors.address.message}</FormError>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='email'>
                      <FormattedMessage id='label.email' defaultMessage='Email' />
                    </Label>
                    <Input type='email' id='email' name='email' innerRef={register()} />
                  </FormGroup>
                </Col>

                <Col sm='6'>
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
                </Col>
              </Row>

              <FormGroup>
                <Row>
                  <Col sm='6'>
                    <Row>
                      <Col sm='6'>
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
                      </Col>
                      <Col sm='6'>
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
                      </Col>
                    </Row>
                  </Col>

                  <Col sm='6'>
                    <FormGroup>
                      <Label for='country'>
                        <FormattedMessage id='label.country' defaultMessage='Country' />
                      </Label>
                      <Select
                        name='countryId'
                        control={control}
                        options={enumToSelectOptions(CountryEnum)}
                        isClearable={false}
                        getOptionLabel={option => (
                          <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                        )}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>

              <Row>
                <Col sm='6'>
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
                </Col>

                <Col sm='6'>
                  <FormGroup>
                    <Label for='allergy'>
                      <FormattedMessage id='label.allergy' defaultMessage='Allergy' />
                    </Label>
                    <TextArea name='allergy' id='allergy' innerRef={register()} handleSubmit={handleSubmitForm} />
                  </FormGroup>
                </Col>
              </Row>
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

export default EditContactInfoModal
