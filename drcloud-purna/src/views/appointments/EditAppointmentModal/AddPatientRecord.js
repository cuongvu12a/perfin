import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  CustomInput,
  Input,
  Label,
  FormGroup,
  Form,
  Button,
  Row,
  Col
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Component
import Select from '@components/Select'
import FormError from '@components/FormError'
import Toast from '@utility/toast'
import PhoneInput from '@components/PhoneInput'
import DatePicker from '@components/DatePicker'
import { GenderEnum, CountryEnum, KeyBoardEnum, FrontEndScreenEnum, FrontEndFeatureEnum } from '@utility/constants'
import { enumToSelectOptions } from '@utility/utils'
import { createClinicPatientAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import { format } from 'date-fns'

const xScreenId = FrontEndScreenEnum.Appointments

const AddPatientRecord = ({
  open,
  handleError403,
  close,
  setRefreshClinicPatientToggle,
  refreshClinicPatientToggle
}) => {
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

  const addPatientRecordSchema = yup.object().shape({
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
    resolver: yupResolver(addPatientRecordSchema),
    defaultValues
  })

  const onSubmit = async data => {
    try {
      data.birthdayUnix = data.birthdayUnix.getTime()
      const res = await createClinicPatientAPI(data, xScreenId, FrontEndFeatureEnum.AddAppointment)
      Toast.showSuccess('toast.success')
      close(res.data)
      setRefreshClinicPatientToggle(!refreshClinicPatientToggle)
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

  return (
    <div
      className={classNames('sidebar-right', {
        show: open
      })}
      onKeyDown={e => {
        if (e.key === KeyBoardEnum.Escape) {
          closeModal()
        }
      }}
    >
      <Form>
        <div className='sidebar-content modal-sidebar mb-5'>
          <ModalHeader tag='h2' toggle={() => closeModal()}>
            <FormattedMessage id='title.createPatientRecord' defaultMessage='Create Patient Record' />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='fullName'>
                <FormattedMessage id='label.fullName' defaultMessage='Full name' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input id='fullName' name='fullName' autoFocus innerRef={register()} invalid={errors.fullName && true} />
              {errors && errors.fullName && <FormError>{errors.fullName.message}</FormError>}
            </FormGroup>
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
                  <FormGroup>
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
              <Label for='phoneNumber'>
                <FormattedMessage id='label.phoneNumber' defaultMessage='Phone number' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <PhoneInput name='phoneNumber' control={control} invalid={!!errors && !!errors.phoneNumber} />
              {errors && errors.phoneNumber && <FormError>{errors.phoneNumber.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label for='address'>
                <FormattedMessage id='label.address' defaultMessage='Address' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input id='address' name='address' innerRef={register()} invalid={errors.address && true} />
              {errors && errors.address && <FormError>{errors.address.message}</FormError>}
            </FormGroup>

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

            <FormGroup>
              <Label for='email'>
                <FormattedMessage id='label.email' defaultMessage='Email' />
              </Label>
              <Input type='email' id='email' name='email' innerRef={register()} />
            </FormGroup>

            <FormGroup>
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
            </FormGroup>

            <FormGroup>
              <Label for='medicalHistory'>
                <FormattedMessage id='label.medicalHistory' defaultMessage='Medical History' />
              </Label>
              <Input name='medicalHistory' id='medicalHistory' innerRef={register()} />
            </FormGroup>

            <FormGroup>
              <Label for='allergy'>
                <FormattedMessage id='label.allergy' defaultMessage='Allergy' />
              </Label>
              <Input
                name='allergy'
                id='allergy'
                innerRef={register()}
                onKeyDown={e => {
                  if (e.key === KeyBoardEnum.Tab) {
                    e.preventDefault()
                  }
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!formState.isDirty && (
              <Button color='secondary' outline onClick={() => closeModal()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}
            {formState.isDirty && (
              <>
                <Button color='secondary' outline onClick={() => closeModal()}>
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
        </div>
      </Form>
    </div>
  )
}

export default AddPatientRecord
