import { Fragment, useState, useEffect, useMemo, useRef, memo } from 'react'
import {
  Badge,
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
  Media,
  CustomInput,
  UncontrolledTooltip
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { startOfDay, format } from 'date-fns'
import UILoader from '@core/components/ui-loader'
import classNames from 'classnames'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import { HelpCircle } from 'react-feather'
import { getErrorMessage } from '@api/handleApiError'
import {
  getClinicPatientAPI,
  getScheduleSlotsAPI,
  createClinicAppointmentAPI,
  updateClinicAppointmentAPI,
  getClinicAppointmentByIdForEditAPI,
  updateClinicPatientAvatarAPI
} from '@api/main'
import Toast from '@utility/toast'
import { selectThemeColors, arrayToSelectOptions, reverseEnumObject } from '@utility/utils'
import {
  GenderEnum,
  AppointmentStatusDisplayConfig,
  KeyBoardEnum,
  FrontEndScreenEnum,
  FrontEndFeatureEnum,
  AppointmentConfig,
  AppointmentStatusEnum
} from '@utility/constants'
import DatePicker from '@components/DatePicker'
import PillSelect from '@components/PillSelect'
import AddPatientRecord from './AddPatientRecord'
import AvatarWrapper from '@components/AvatarWrapper'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.Appointments

const EditAppointmentModal = ({ open, close, appointmentId, mode, handleError403 }) => {
  // Redux
  const clinicData = useSelector(state => state.auth.clinicData)
  const intl = useIntl()

  // Ref
  const createInputRef = useRef()
  const updateInputRef = useRef()

  // data states
  const [allSlots, setAllSlots] = useState([]) // [{scheduleId, occurrenceStartUnix, occurrenceDate, slotTime}]
  const [userInfo, setUserInfo] = useState(null)
  const [notReservedCheck, setNotReserverdCheck] = useState(false)
  // UI states
  const [openSidebar, setOpenSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // options states
  const [locations, setLocations] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointmentDates, setAppointmentDates] = useState([])
  const [appointmentTimes, setAppointmentTimes] = useState([])
  const [symptomSuggests, setSymptomSuggests] = useState([])

  // value state
  const [clinicPatientId, setClinicPatientId] = useState(null)
  const [locationId, setLocationId] = useState(null)
  const [specialtyId, setSpecialtyId] = useState(null)
  const [doctorId, setDoctorId] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState(null)
  const [appointmentTime, setAppointmentTime] = useState(null)
  const [isAppointmentTimeInvalid, setIsAppointmentTimeInvalid] = useState(false)
  const [symptom, setSymptom] = useState('')
  const [appointmentStatusId, setAppointmentStatusId] = useState(null)

  const [asyncSelectValue, setAsyncSelectValue] = useState(null)
  const [refreshClinicPatientToggle, setRefreshClinicPatientToggle] = useState(false)

  useEffect(async () => {
    setIsEditing(!isEditing)
    setLocations(clinicData.locations)
    setSpecialties(clinicData.specialties)
    setDoctors(clinicData.doctors)
    setSymptomSuggests(clinicData.symptoms)

    if (!appointmentId) {
      setLocationId(clinicData.locations[0]?.locationId)
      setDoctorId(clinicData.doctors[0]?.doctorId)
      return
    }

    try {
      setIsLoading(true)

      const res = await getClinicAppointmentByIdForEditAPI(appointmentId, xScreenId)
      setUserInfo(res.data)
      setDoctorId(res.data.doctorId)
      setLocationId(res.data.locationId)
      setSymptom(res.data.symptom)
      setAppointmentStatusId(res.data.appointmentStatusId)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(async () => {
    try {
      setIsLoading(true)
      if (locationId && doctorId) {
        const occurencesRes = await getScheduleSlotsAPI(
          { locationId, doctorId },
          xScreenId,
          FrontEndFeatureEnum.AddAppointment
        )

        // Flat occurencces to slots
        const dates = []
        const slots = []
        occurencesRes.data
          .sort((a, b) => a.occurrenceStartUnix - b.occurrenceStartUnix)
          .forEach(occurence => {
            const date = startOfDay(occurence.occurrenceStartUnix).valueOf()
            if (!dates.includes(date)) {
              dates.push(date)
            }

            occurence.slots
              .sort((a, b) => a - b)
              .forEach(slot => {
                slots.push({
                  scheduleId: occurence.scheduleId,
                  occurrenceDate: date,
                  slotTime: slot
                })
              })
          })
        // Update states
        setAllSlots(slots)
        if (!userInfo) {
          // create mode
          setAppointmentDates(dates)
          setAppointmentDate(dates.length > 0 ? new Date(dates[0]) : new Date())
        } else {
          // update mode
          // Set current date & time of appointment for selection data
          if (userInfo.locationId === locationId && userInfo.doctorId === doctorId) {
            if (userInfo.scheduleId) {
              const currentDate = startOfDay(userInfo.startDatetimeUnix).valueOf()
              if (!dates.includes(currentDate)) {
                const newDates = [...dates, currentDate].sort((a, b) => a - b)
                setAppointmentDates(newDates)
              }
              setAppointmentDates(dates)
              setAppointmentDate(new Date(currentDate))

              // add slot for current appointment
              const currentOccurrenceDate = startOfDay(userInfo.startDatetimeUnix).valueOf()
              if (
                slots.findIndex(
                  s =>
                    s.scheduleId === userInfo.scheduleId &&
                    s.occurrenceDate === currentOccurrenceDate &&
                    s.slotTime === userInfo.startDatetimeUnix
                ) < 0
              ) {
                slots.push({
                  scheduleId: userInfo.scheduleId,
                  occurrenceDate: startOfDay(userInfo.startDatetimeUnix).valueOf(),
                  slotTime: userInfo.startDatetimeUnix
                })
              }

              slots.sort((a, b) => a.slotTime - b.slotTime)
              setAllSlots(slots)

              const selectedSlots = slots.find(d => d.slotTime === userInfo.startDatetimeUnix)
              setAppointmentTime(selectedSlots)
            } else {
              setNotReserverdCheck(true)
              setAppointmentDate(new Date())
              setAppointmentDates(dates)
            }
          } else {
            setAppointmentDates(dates)
            setAppointmentDate(dates.length > 0 ? new Date(dates[0]) : new Date())
          }
        }
      } else {
        setAppointmentDates([])
        setAppointmentTimes([])
        setAppointmentDate(null)
        setAppointmentTime(null)
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }, [locationId, doctorId])

  // *filter day with different time
  useEffect(() => {
    const filteredSlots = allSlots.filter(d => d.occurrenceDate === new Date(appointmentDate).valueOf())

    const convertSlots = filteredSlots.map(slot => {
      return {
        label: format(slot.slotTime, 'HH:mm'),
        value: slot
      }
    })

    setAppointmentTimes(convertSlots)
    setAppointmentTime(null)
  }, [allSlots, appointmentDate])

  useEffect(() => {
    if (mode === 'create') {
      if (createInputRef.current) {
        createInputRef.current.focus()
      }
    } else {
      if (updateInputRef.current) {
        updateInputRef.current.focus()
      }
    }
  }, [isEditing])

  const isAllowedSubmit = useMemo(() => {
    if (!userInfo) {
      return !!clinicPatientId && !!locationId && !!doctorId && (!!notReservedCheck || !!appointmentTime)
    }
    return (
      !!locationId &&
      !!doctorId &&
      (!!notReservedCheck || !!appointmentTime) &&
      (userInfo.appointmentStatusId === AppointmentStatusEnum.Invalid ||
        locationId !== userInfo.locationId ||
        doctorId !== userInfo.doctorId ||
        (!!userInfo.scheduleId && notReservedCheck) ||
        (!userInfo.scheduleId && !notReservedCheck) ||
        (!!userInfo.scheduleId && userInfo.startDatetimeUnix !== appointmentTime.slotTime))
    )
  }, [clinicPatientId, locationId, doctorId, appointmentTime, isAppointmentTimeInvalid, notReservedCheck])

  // *load async select options
  const loadPatients = async keyword => {
    const response = await getClinicPatientAPI(keyword, xScreenId, FrontEndFeatureEnum.AddAppointment)
    const data = response.data.map(c => {
      return {
        patientName: c.patientName,
        clinicPatientId: c.clinicPatientId,
        patient: {
          patientName: c.patientName,
          birthdayUnix: c.birthdayUnix,
          gender: c.gender,
          avatar: c.avatar
        }
      }
    })
    return arrayToSelectOptions(data, 'patientName', 'clinicPatientId', 'patient')
  }

  const closeSidebar = newPatient => {
    setOpenSidebar(!openSidebar)
    setTimeout(() => {
      createInputRef.current.focus()
    }, 150)

    if (newPatient?.clinicPatientId) {
      setClinicPatientId(newPatient.clinicPatientId)
      setAsyncSelectValue({ label: newPatient.patientName, value: newPatient.clinicPatientId })
    }
  }

  const handlePatientChanged = value => {
    setClinicPatientId(value?.value)
    setAsyncSelectValue(value)
  }

  const handleLocationChanged = value => {
    setLocationId(value.locationId)
  }

  const handleSpecialtyChanged = value => {
    setSpecialtyId(value?.specialtyId)
    if (value) {
      const filteredDoctors = clinicData.doctors.filter(d => d.specialtyId === value.specialtyId)
      const filteredSymptomSuggests = clinicData.symptoms.filter(d => d.specialtyId === value.specialtyId)

      setDoctors(filteredDoctors)
      setDoctorId(filteredDoctors.length > 0 ? filteredDoctors[0].doctorId : null)
      setSymptomSuggests(filteredSymptomSuggests)
    } else {
      setDoctors(clinicData.doctors)
      setDoctorId(clinicData.doctors[0].doctorId)
      setSymptomSuggests(clinicData.symptoms)
    }
  }

  const handleDoctorChanged = value => {
    setDoctorId(value.doctorId)
  }

  const handleDateChanged = value => {
    setAppointmentDate(value)
  }
  const handelTimeChanged = value => {
    setAppointmentTime(value)
    setIsAppointmentTimeInvalid(
      new Date().valueOf() > value.slotTime - AppointmentConfig.AllowBookingBeforeMinutes * 60 * 1000 &&
        userInfo?.startDatetimeUnix !== value.slotTime
    )
  }

  const handleSymptomSuggestClick = item => {
    const value = symptom ? `${symptom}, ${item.content}` : `${item.content}`
    setSymptom(value)
  }

  const toggleChecked = () => {
    setNotReserverdCheck(!notReservedCheck)
    setIsAppointmentTimeInvalid(notReservedCheck)
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (
      !!appointmentTime &&
      new Date().valueOf() > appointmentTime.slotTime - AppointmentConfig.AllowBookingBeforeMinutes * 60 * 1000 &&
      userInfo?.startDatetimeUnix !== appointmentTime.slotTime
    ) {
      setIsAppointmentTimeInvalid(true)
      return
    }
    const data = {
      clinicPatientId,
      locationId,
      doctorId,
      scheduleId: !notReservedCheck ? (appointmentTime.scheduleId ? appointmentTime.scheduleId : null) : null,
      startDatetimeUnix: !notReservedCheck ? appointmentTime.slotTime : null,
      symptom: symptom.trim()
    }

    // handel logic
    try {
      if (!appointmentId) {
        await createClinicAppointmentAPI(data, xScreenId, FrontEndFeatureEnum.AddAppointment)
        // console.log('create data', data)
      } else {
        delete data.clinicPatientId
        // console.log('update data', data)
        await updateClinicAppointmentAPI(appointmentId, data, xScreenId)
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

  const OptionComponent = memo(({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <AvatarWrapper
          imgUrl={data.condition.avatar?.fileUrl}
          title={data.condition.patientName}
          subTitle={`${intl.formatMessage({
            id: `enum.${reverseEnumObject(GenderEnum)[data.condition.gender || GenderEnum.Male]}`
          })} - ${new Date(data.condition.birthdayUnix).getFullYear()}`}
          size='sm'
        />
      </components.Option>
    )
  })

  return (
    <Fragment>
      <Modal
        isOpen={open}
        autoFocus={false}
        backdrop='static'
        toggle={close}
        className='modal-dialog-centered modal-md modal-edit-schedule'
        key='EditScheduleModal'
        id='edit-schedule-modal'
      >
        <Form>
          <ModalHeader tag='h2' toggle={close}>
            {mode === 'create' && <FormattedMessage id='title.addingAppointment' defaultMessage='Adding Appointment' />}
            {mode === 'update' && (
              <FormattedMessage id='title.editingAppointment' defaultMessage='Editing Appointment' />
            )}
          </ModalHeader>
          <UILoader blocking={isLoading}>
            <ModalBody>
              <Row>
                {mode === 'create' && (
                  <>
                    <Col sm='7'>
                      <FormGroup>
                        <Label for='clinicPatientId'>
                          <FormattedMessage id='label.patientRecord' defaultMessage='Patient Record' />
                          <span className='text-danger'>&nbsp;*</span>
                        </Label>
                        <AsyncSelect
                          key={refreshClinicPatientToggle}
                          theme={selectThemeColors}
                          className='react-select'
                          id='clinicPatientId'
                          classNamePrefix='select'
                          defaultOptions
                          maxMenuHeight={342}
                          isClearable={true}
                          styles={{
                            valueContainer: (provided, state) => ({
                              ...provided,
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            })
                          }}
                          placeholder={
                            <FormattedMessage
                              id='placeholder.selectRecord'
                              defaultMessage='Enter a name, phone number, email or patient code...'
                            />
                          }
                          loadOptions={loadPatients}
                          onChange={e => handlePatientChanged(e)}
                          components={{
                            Option: OptionComponent
                          }}
                          value={asyncSelectValue}
                          ref={createInputRef}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm='5'>
                      <FormGroup className='d-flex mt-2 align-items-center'>
                        <FormattedMessage id='label.or' defaultMessage='Or' />
                        <div className='ml-2'>
                          <Button color='primary' onClick={() => setOpenSidebar(true)} outline>
                            <FormattedMessage id='button.add' defaultMessage='Add' />
                          </Button>
                        </div>
                      </FormGroup>
                    </Col>
                  </>
                )}

                {mode === 'update' && (
                  <>
                    <Col sm='7'>
                      <FormGroup>
                        <Label for='clinicPatientId'>
                          <FormattedMessage id='label.patientRecord' defaultMessage='Patient Record' />
                        </Label>
                        <Media className='align-items-center justify-content-between'>
                          <AvatarWrapper
                            imgUrl={userInfo?.patient.avatar?.fileUrl}
                            title={userInfo?.patient.fullName}
                            subTitle={`${intl.formatMessage({
                              id: `enum.${reverseEnumObject(GenderEnum)[userInfo?.patient.gender || GenderEnum.Male]}`
                            })} - ${new Date(userInfo?.patient.birthdayUnix).getFullYear()}`}
                            size='lg'
                          />
                          <Badge
                            className='badge-status-appointment'
                            color={AppointmentStatusDisplayConfig[appointmentStatusId]?.color}
                            pill
                          >
                            <FormattedMessage
                              id={`enum.${AppointmentStatusDisplayConfig[appointmentStatusId]?.title}`}
                              defaultMessage={`${AppointmentStatusDisplayConfig[appointmentStatusId]?.title}`}
                            />
                          </Badge>
                        </Media>
                      </FormGroup>
                    </Col>
                  </>
                )}
              </Row>
              <Row>
                <Col sm='7'>
                  <FormGroup>
                    <Label for='locationId'>
                      <FormattedMessage id='label.location' defaultMessage='Location' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      maxMenuHeight={150}
                      isClearable={false}
                      placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                      getOptionLabel={op => op.locationName}
                      getOptionValue={op => op.locationId}
                      value={locations.find(op => op.locationId === locationId) || null}
                      options={locations}
                      onChange={handleLocationChanged}
                      ref={updateInputRef}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='7'>
                  <FormGroup>
                    <Label for='specialtyId'>
                      <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      maxMenuHeight={150}
                      isClearable={true}
                      placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                      getOptionLabel={op => op.specialtyName}
                      getOptionValue={op => op.specialtyId}
                      value={specialties.find(op => op.specialtyId === specialtyId) || null}
                      options={specialties}
                      onChange={handleSpecialtyChanged}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm='7'>
                  <FormGroup>
                    <Label for='doctorId'>
                      <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      maxMenuHeight={150}
                      isClearable={false}
                      placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                      getOptionLabel={op => op.doctorName}
                      getOptionValue={op => op.doctorId}
                      value={doctors.find(op => op.doctorId === doctorId) || null}
                      options={doctors}
                      onChange={handleDoctorChanged}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <>
                <Row>
                  <Col sm='7'>
                    <FormGroup>
                      <Label for='appointmentDate'>
                        <FormattedMessage id='label.appointmentDate' defaultMessage='Date' />
                        <span className='text-danger'>&nbsp;*</span>
                      </Label>
                      <DatePicker
                        id='date'
                        value={appointmentDate}
                        onChange={e => handleDateChanged(e)}
                        disabled={notReservedCheck}
                        disabledDay={day => !appointmentDates?.find(d => d === day.valueOf())}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm='5' className='mt-2 d-flex align-items-center'>
                    <FormGroup className='d-flex align-items-center'>
                      <CustomInput
                        type='checkbox'
                        id='reseveredCheckBox'
                        checked={notReservedCheck}
                        onChange={toggleChecked}
                        className='custom-control-Primary'
                        label={<FormattedMessage id='label.notReserved' defaultMessage='Not Reserved' />}
                      />
                      <div className='ml-50'>
                        <HelpCircle size='18' id='toolTip' />
                        <UncontrolledTooltip placement='top' target='toolTip'>
                          <FormattedMessage id='editAppointment.notReservedTooltip' defaultMessage='Not Reserved' />
                        </UncontrolledTooltip>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm='12'>
                    <div className='d-flex flex-column '>
                      <Label for='appointmentTime'>
                        <FormattedMessage id='label.appointmentTime' defaultMessage='Time' />
                      </Label>
                      <div className='d-flex flex-wrap pill-select'>
                        <PillSelect
                          options={appointmentTimes}
                          value={appointmentTime}
                          onChange={e => handelTimeChanged(e)}
                          disable={notReservedCheck}
                        />
                      </div>
                      {isAppointmentTimeInvalid && (
                        <div className='invalid-feedback d-flex mt-0 mb-50'>
                          <FormattedMessage id='formError.isAppointmentTimeInvalid' />
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </>

              <Row>
                <Col sm='7'>
                  <FormGroup>
                    <Label for='symptom'>
                      <FormattedMessage id='label.symptom' defaultMessage='Symptom' />
                    </Label>
                    <TextArea
                      name='symptom'
                      id='symptom'
                      value={symptom}
                      onChange={e => setSymptom(e.target.value)}
                      handleSubmit={() => !isLoading && isAllowedSubmit && handleSubmit()}
                    />
                  </FormGroup>
                </Col>
                <Col sm='12'>
                  <FormGroup>
                    <div className='d-flex flex-wrap pill-select'>
                      <>
                        {symptomSuggests.length !== 0 && (
                          <>
                            {symptomSuggests.map((d, index) => (
                              <Button
                                className='round mr-50 mb-50 btn-toggle'
                                size='sm'
                                color='success'
                                key={index}
                                onClick={() => handleSymptomSuggestClick(d)}
                                outline={true}
                              >
                                {d.symptomName}
                              </Button>
                            ))}
                          </>
                        )}
                      </>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
              </Button>
              <Button color='primary' type='submit' onClick={handleSubmit} disabled={isLoading || !isAllowedSubmit}>
                <FormattedMessage id='button.save' defaultMessage='Save' />
              </Button>
            </ModalFooter>
          </UILoader>
        </Form>

        <div
          className={classNames('body-content-overlay', {
            show: openSidebar
          })}
          onClick={closeSidebar}
        ></div>
        {openSidebar && (
          <AddPatientRecord
            open={openSidebar}
            handleError403={handleError403}
            close={closeSidebar}
            setRefreshClinicPatientToggle={setRefreshClinicPatientToggle}
            refreshClinicPatientToggle={refreshClinicPatientToggle}
          />
        )}
      </Modal>
    </Fragment>
  )
}

export default EditAppointmentModal
