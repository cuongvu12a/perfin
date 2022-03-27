import { Fragment, useContext, useState, useEffect } from 'react'
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
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { RRule, Weekday } from 'rrule'
import { useSelector } from 'react-redux'
import { startOfDay, addMonths, addHours, getDay, format } from 'date-fns'
import { enGB as en, vi } from 'date-fns/locale'
import classNames from 'classnames'
import UILoader from '@core/components/ui-loader'

import { createDoctorScheduleAPI, getScheduleByIdAPI, updateDoctorScheduleAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import {
  RecurrenceOptionEnum,
  RecurrenceFrequencyEnum,
  RecurrenceEndsEnum,
  EditDoctorScheduleApplyToEnum,
  EditDoctorScheduleCaseEnum,
  RecurrenceByWeekdayEnum,
  FrontEndScreenEnum
} from '@utility/constants'
import { enumToSelectOptions, arrayToSelectOptions, enumToDialogOptions } from '@utility/utils'
import { IntlContext } from '@utility/context/Internationalization'
import Toast from '@utility/toast'
import { rruleToString, stringToRRuleSet, isEqualRRule } from '@utility/calendarHelper'
import Dialog from '@utility/dialog'
import Select from '@components/Select'
import DatePicker from '@components/DatePicker'
import TimePicker from '@components/TimePicker'

const xScreenId = FrontEndScreenEnum.DoctorSchedules
const locales = { en, vi }

const DayOfWeekToggle = ({ control, name, label }) => (
  <Controller
    control={control}
    name={name}
    render={({ onChange, value }) => {
      return (
        <Button className='round mr-50 btn-toggle' color='primary' outline={!value} onClick={() => onChange(!value)}>
          <FormattedMessage id={`enum.${label}`} defaultMessage={label} />
        </Button>
      )
    }}
  />
)

const EditDoctorScheduleModal = ({ open, close, handleError403, occurrence, initDate }) => {
  // Vars
  const initDay = startOfDay(initDate || new Date())
  const initDayOfWeek = getDay(initDate || new Date())
  const initStartTime = initDate || initDay
  // Hooks
  const clinicData = useSelector(state => state.auth.clinicData)
  const intlContext = useContext(IntlContext)
  const intl = useIntl()
  // States
  const [oldRRule, setOldRRule] = useState(null)
  const [block, setBlock] = useState()

  const EditDoctorScheduleSchema = yup.object().shape({
    doctorId: yup.string().required(),
    locationId: yup.string().required(),
    recurrenceInterval: yup.number().min(1).max(12),
    recurrenceEndsAfter: yup.number().min(1).max(1000)
  })
  const defaultValues = {
    doctorId: null,
    locationId: null,
    date: initDay,
    startTime: initStartTime.getHours() === 0 ? addHours(initStartTime, 9) : initStartTime,
    endTime: initStartTime.getHours() === 0 ? addHours(initStartTime, 12) : addHours(initStartTime, 3),
    recurrenceOption: RecurrenceOptionEnum.NoRepeat,
    recurrenceInterval: 1,
    recurrenceFrequency: RecurrenceFrequencyEnum.DAILY,
    recurrenceByMonday: initDayOfWeek === 1,
    recurrenceByTuesday: initDayOfWeek === 2,
    recurrenceByWednesday: initDayOfWeek === 3,
    recurrenceByThursday: initDayOfWeek === 4,
    recurrenceByFriday: initDayOfWeek === 5,
    recurrenceBySaturday: initDayOfWeek === 6,
    recurrenceBySunday: initDayOfWeek === 0,
    recurrenceEnds: RecurrenceEndsEnum.Never,
    recurrenceEndsOnDay: addMonths(initDay, 1),
    recurrenceEndsAfter: 10
  }
  const { register, handleSubmit, watch, reset, formState, control } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditDoctorScheduleSchema),
    defaultValues
  })
  const date = watch('date')
  const recurrenceOption = watch('recurrenceOption')
  const recurrenceFrequency = watch('recurrenceFrequency')
  const recurrenceEnds = watch('recurrenceEnds')

  useEffect(async () => {
    if (!occurrence) {
      return
    }

    try {
      // TODO: consider to get schedule data from page or right slide bar
      setBlock(true)
      const res = await getScheduleByIdAPI(occurrence.scheduleId, xScreenId)

      // Single schedule
      if (!res.data.recurrenceString) {
        reset({
          ...defaultValues,
          doctorId: res.data.doctor.doctorId,
          locationId: res.data.locationId,
          date: startOfDay(occurrence.startTime),
          startTime: new Date(res.data.startDateTimeUnix),
          endTime: new Date(res.data.endDateTimeUnix),
          recurrenceOption: RecurrenceOptionEnum.NoRepeat
        })
        return
      }

      // Recurring schedule
      const rruleSet = stringToRRuleSet(res.data.recurrenceString)
      if (!rruleSet || rruleSet.rrules().count === 0 || !rruleSet.rrules()[0].options) {
        throw new Error('Can not parse recurrence string')
      }
      // Save string to compare later when submit
      setOldRRule(rruleSet.rrules()[0])
      // Convert to form values
      const rruleOptions = rruleSet.rrules()[0].options
      let option = RecurrenceOptionEnum.Custom
      if (rruleOptions.freq === RecurrenceFrequencyEnum.DAILY && rruleOptions.interval === 1) {
        option = RecurrenceOptionEnum.Daily
      } else if (
        rruleOptions.freq === RecurrenceFrequencyEnum.WEEKLY &&
        rruleOptions.interval === 1 &&
        rruleOptions.byweekday.length === 1
      ) {
        option = RecurrenceOptionEnum.WeeklyOnDayOfWeek
      } else if (
        rruleOptions.freq === RecurrenceFrequencyEnum.WEEKLY &&
        rruleOptions.interval === 1 &&
        rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.MO) &&
        rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.TU) &&
        rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.WE) &&
        rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.TH) &&
        rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.FR) &&
        !rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.SA) &&
        !rruleOptions.byweekday.includes(RecurrenceByWeekdayEnum.SU)
      ) {
        option = RecurrenceOptionEnum.EveryWorkDaysOfWeek
      }
      let endsType = RecurrenceEndsEnum.Never
      if (rruleOptions.count) {
        endsType = RecurrenceEndsEnum.After
      } else if (rruleOptions.until) {
        endsType = RecurrenceEndsEnum.OnDay
      }
      reset({
        ...defaultValues,
        doctorId: res.data.doctor.doctorId,
        locationId: res.data.locationId,
        date: startOfDay(occurrence.startTime),
        startTime: new Date(res.data.startDateTimeUnix),
        endTime: new Date(res.data.endDateTimeUnix),
        recurrenceOption: option,
        recurrenceInterval: rruleOptions.interval,
        recurrenceFrequency: rruleOptions.freq,
        recurrenceByMonday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.MO) || false,
        recurrenceByTuesday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.TU) || false,
        recurrenceByWednesday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.WE) || false,
        recurrenceByThursday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.TH) || false,
        recurrenceByFriday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.FR) || false,
        recurrenceBySaturday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.SA) || false,
        recurrenceBySunday: rruleOptions.byweekday?.includes(RecurrenceByWeekdayEnum.SU) || false,
        recurrenceEnds: endsType,
        recurrenceEndsOnDay: rruleOptions.until ? startOfDay(new Date(rruleOptions.until)) : addMonths(initDay, 1),
        recurrenceEndsAfter: rruleOptions.count ? rruleOptions.count : 10
      })
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setBlock(false)
    }
  }, [])

  const onSubmit = async data => {
    // Convert data to schedule modal
    const newScheduleModal = {
      doctorId: data.doctorId,
      locationId: data.locationId,
      startDateTimeUnix: data.date.setHours(data.startTime.getHours(), data.startTime.getMinutes(), 0),
      endDateTimeUnix: data.date.setHours(data.endTime.getHours(), data.endTime.getMinutes(), 0),
      recurrenceString: ''
    }

    // Build recurrence string
    let newRRule = null
    if (data.recurrenceOption !== RecurrenceOptionEnum.NoRepeat) {
      const rule = {
        until:
          data.recurrenceEnds === RecurrenceEndsEnum.OnDay
            ? new Date(data.recurrenceEndsOnDay.setHours(data.endTime.getHours(), data.endTime.getMinutes(), 0))
            : null,
        count: data.recurrenceEnds === RecurrenceEndsEnum.After ? data.recurrenceEndsAfter : null
      }
      if (data.recurrenceOption === RecurrenceOptionEnum.Daily) {
        rule.freq = RecurrenceFrequencyEnum.DAILY
        rule.interval = 1
      } else if (data.recurrenceOption === RecurrenceOptionEnum.WeeklyOnDayOfWeek) {
        rule.freq = RecurrenceFrequencyEnum.WEEKLY
        rule.interval = 1
        rule.byweekday = [new Weekday(data.date.getDay() === 0 ? 6 : data.date.getDay() - 1)]
      } else if (data.recurrenceOption === RecurrenceOptionEnum.EveryWorkDaysOfWeek) {
        rule.freq = RecurrenceFrequencyEnum.WEEKLY
        rule.interval = 1
        rule.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
      } else if (data.recurrenceOption === RecurrenceOptionEnum.Custom) {
        rule.freq = data.recurrenceFrequency
        rule.interval = data.recurrenceInterval
        rule.byweekday =
          data.recurrenceFrequency === RecurrenceFrequencyEnum.WEEKLY
            ? [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU].filter(d => {
                return (
                  (d === RRule.MO && data.recurrenceByMonday) ||
                  (d === RRule.TU && data.recurrenceByTuesday) ||
                  (d === RRule.WE && data.recurrenceByWednesday) ||
                  (d === RRule.TH && data.recurrenceByThursday) ||
                  (d === RRule.FR && data.recurrenceByFriday) ||
                  (d === RRule.SA && data.recurrenceBySaturday) ||
                  (d === RRule.SU && data.recurrenceBySunday)
                )
              })
            : null
      }
      newRRule = new RRule(rule)
      newScheduleModal.recurrenceString = rruleToString(newRRule)
    }

    //handle logic
    try {
      if (!occurrence) {
        // Create
        await createDoctorScheduleAPI(newScheduleModal, xScreenId)
      } else {
        // Update
        newScheduleModal.occurrenceStart = occurrence.startTime.getTime()
        if (!oldRRule && !newRRule) {
          newScheduleModal.editCaseType = EditDoctorScheduleCaseEnum.SingleToSingle
        } else if (!oldRRule && !!newRRule) {
          newScheduleModal.editCaseType = EditDoctorScheduleCaseEnum.SingleToRecurring
        } else if (!newRRule) {
          newScheduleModal.editCaseType = EditDoctorScheduleCaseEnum.RecurringInfoAndToSingle
        } else if (isEqualRRule(newRRule, oldRRule)) {
          newScheduleModal.editCaseType = EditDoctorScheduleCaseEnum.RecurringInfoOnly
        } else {
          newScheduleModal.editCaseType = EditDoctorScheduleCaseEnum.RecurringInfoAndRrule
        }

        if (newScheduleModal.editCaseType === EditDoctorScheduleCaseEnum.RecurringInfoOnly) {
          const dialogResult = await Dialog.showRadioInput({
            title: intl.formatMessage({ id: 'dialog.editRecurringScheduleTitle' }),
            text: intl.formatMessage({ id: 'dialog.editRecurringScheduleMessage' }),
            options: enumToDialogOptions(EditDoctorScheduleApplyToEnum, key => {
              return intl.formatMessage({ id: `enum.${key}` })
            }),
            confirmButtonText: intl.formatMessage({ id: 'button.save' }),
            cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
          })
          if (!dialogResult.isConfirmed) {
            return
          }
          newScheduleModal.editApplyTo = parseInt(dialogResult.value)
        } else if (
          newScheduleModal.editCaseType === EditDoctorScheduleCaseEnum.RecurringInfoAndRrule ||
          newScheduleModal.editCaseType === EditDoctorScheduleCaseEnum.RecurringInfoAndToSingle
        ) {
          const dialogResult = await Dialog.showRadioInput({
            title: intl.formatMessage({ id: 'dialog.editRecurringScheduleTitle' }),
            text: intl.formatMessage({ id: 'dialog.editRecurringScheduleMessage' }),
            options: enumToDialogOptions(
              { ThisAndFollowingOccurrences: EditDoctorScheduleApplyToEnum.ThisAndFollowingOccurrences },
              key => {
                return intl.formatMessage({ id: `enum.${key}` })
              }
            ),
            confirmButtonText: intl.formatMessage({ id: 'button.save' }),
            cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
          })
          if (!dialogResult.isConfirmed) {
            return
          }
          newScheduleModal.editApplyTo = parseInt(dialogResult.value)
        } else {
          const dialogResult = await Dialog.showQuestion({
            title: intl.formatMessage({ id: 'dialog.warningWhenEditDoctorScheduleTitle' }),
            text: intl.formatMessage({ id: 'dialog.warningWhenEditDoctorScheduleMessage' }),
            confirmButtonText: intl.formatMessage({ id: 'button.ok' }),
            cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
          })
          if (!dialogResult.isConfirmed) {
            return
          }
        }

        await updateDoctorScheduleAPI(occurrence.scheduleId, newScheduleModal, xScreenId)
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

  return (
    <Fragment>
      <Modal
        isOpen={open}
        autoFocus={false}
        toggle={close}
        backdrop='static'
        className='modal-dialog-centered modal-md modal-edit-schedule'
        key='EditScheduleModal'
        id='edit-schedule-modal'
      >
        <Form>
          <ModalHeader tag='h2' toggle={close}>
            {!occurrence && (
              <FormattedMessage id='title.addingDoctorSchedule' defaultMessage='Adding Doctor Schedule' />
            )}
            {occurrence && (
              <FormattedMessage
                id='title.editingDoctorSchedule'
                defaultMessage='Editing Schedule on {date}'
                values={{ date: format(occurrence.startTime, 'dd/MM/yyyy') }}
              />
            )}
          </ModalHeader>
          <UILoader blocking={block}>
            <ModalBody>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='doctorId'>
                      <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Select
                      id='doctorId'
                      name='doctorId'
                      autoFocus
                      control={control}
                      maxMenuHeight={150}
                      options={arrayToSelectOptions(clinicData.doctors, 'doctorName', 'doctorId')}
                      isClearable={false}
                      placeholder={
                        <FormattedMessage id='placeholder.selectDoctor' defaultMessage='Select a doctor...' />
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='locatioId'>
                      <FormattedMessage id='label.location' defaultMessage='Location' />
                      <span className='text-danger'>&nbsp;*</span>
                    </Label>
                    <Select
                      id='locatioId'
                      name='locationId'
                      control={control}
                      maxMenuHeight={150}
                      options={arrayToSelectOptions(clinicData.locations, 'locationName', 'locationId')}
                      isClearable={false}
                      placeholder={
                        <FormattedMessage id='placeholder.selectLocation' defaultMessage='Select a location...' />
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='date'>
                      <FormattedMessage id='label.workDate' defaultMessage='Date' />
                    </Label>
                    <Controller
                      control={control}
                      name='date'
                      render={({ onChange, value }) => (
                        <DatePicker id='date' value={value} onChange={onChange} disabledDay={day => day < initDay} />
                      )}
                    />
                  </FormGroup>
                </Col>
                <Col sm='3'>
                  <FormGroup>
                    <Label for='startTime'>
                      <FormattedMessage id='label.from' defaultMessage='From' />
                    </Label>
                    <Controller
                      control={control}
                      name='startTime'
                      render={({ onChange, value }) => <TimePicker id='startTime' value={value} onChange={onChange} />}
                    />
                  </FormGroup>
                </Col>
                <Col sm='3'>
                  <FormGroup>
                    <Label for='endTime'>
                      <FormattedMessage id='label.to' defaultMessage='To' />
                    </Label>
                    <Controller
                      control={control}
                      name='endTime'
                      render={({ onChange, value }) => <TimePicker id='endTime' value={value} onChange={onChange} />}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label for='recurrenceOption'>
                      <FormattedMessage id='label.repeat' defaultMessage='Repeat' />
                    </Label>
                    <Select
                      id='recurrenceOption'
                      name='recurrenceOption'
                      control={control}
                      options={enumToSelectOptions(RecurrenceOptionEnum)}
                      isClearable={false}
                      getOptionLabel={option => (
                        <FormattedMessage
                          id={`enum.${option.label}`}
                          defaultMessage={option.label}
                          values={{ day: format(date, 'EEEE', { locale: locales[intlContext.locale] }) }}
                        />
                      )}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {recurrenceOption === RecurrenceOptionEnum.Custom && (
                <Row>
                  <Col>
                    <Col>
                      <Label tag='h5'>
                        <FormattedMessage id='label.customRepeat' defaultMessage='Custom Repeat' />
                      </Label>
                      <div className='d-flex align-items-center'>
                        <Label for='repeat' className='custom-repeat-label'>
                          <FormattedMessage id='label.repeatEvery' defaultMessage='Repeat every' />
                        </Label>
                        <Input
                          className='custom-repeat-input'
                          id='recurrenceInterval'
                          name='recurrenceInterval'
                          type='number'
                          innerRef={register()}
                        />
                        <Select
                          className='custom-repeat-select'
                          id='recurrenceFrequency'
                          name='recurrenceFrequency'
                          control={control}
                          options={enumToSelectOptions(RecurrenceFrequencyEnum)}
                          isClearable={false}
                          getOptionLabel={option => (
                            <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                          )}
                        />
                      </div>

                      {recurrenceFrequency === RecurrenceFrequencyEnum.WEEKLY && (
                        <div className='d-flex flex-wrap align-items-center mt-50'>
                          <Label for='repeat' className='custom-repeat-label'>
                            <FormattedMessage id='label.repeatOn' defaultMessage='Repeat on' />
                          </Label>

                          <DayOfWeekToggle control={control} name='recurrenceByMonday' label='MO' />
                          <DayOfWeekToggle control={control} name='recurrenceByTuesday' label='TU' />
                          <DayOfWeekToggle control={control} name='recurrenceByWednesday' label='WE' />
                          <DayOfWeekToggle control={control} name='recurrenceByThursday' label='TH' />
                          <DayOfWeekToggle control={control} name='recurrenceByFriday' label='FR' />
                          <DayOfWeekToggle control={control} name='recurrenceBySaturday' label='SA' />
                          <DayOfWeekToggle control={control} name='recurrenceBySunday' label='SU' />
                        </div>
                      )}
                    </Col>
                  </Col>
                </Row>
              )}
              {recurrenceOption !== RecurrenceOptionEnum.NoRepeat && (
                <Row>
                  <Col>
                    <Col>
                      <Label tag='h5' className='mt-50'>
                        <FormattedMessage id='label.ends' defaultMessage='Ends' />
                      </Label>
                      <FormGroup className='mb-50' check>
                        <Label className='custom-repeat-check' check>
                          <Input
                            type='radio'
                            name='recurrenceEnds'
                            innerRef={register()}
                            value={RecurrenceEndsEnum.Never}
                          />
                          <FormattedMessage id='enum.never' defaultMessage='Never' />
                        </Label>
                      </FormGroup>

                      <FormGroup className='mb-50' check>
                        <div className='d-flex align-items-center'>
                          <Label className='custom-repeat-check' check>
                            <Input
                              type='radio'
                              name='recurrenceEnds'
                              innerRef={register()}
                              value={RecurrenceEndsEnum.OnDay}
                            />
                            <FormattedMessage id='enum.onDay' defaultMessage='On' />
                          </Label>
                          <Controller
                            control={control}
                            name='recurrenceEndsOnDay'
                            render={({ onChange, value }) => (
                              <DatePicker
                                className='ml-50'
                                id='recurrenceEndsOnDay'
                                top
                                value={value}
                                onChange={onChange}
                                disabled={recurrenceEnds !== RecurrenceEndsEnum.OnDay}
                                disabledDay={day => day < initDay}
                              />
                            )}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup check>
                        <div className='d-flex align-items-center'>
                          <Label className='custom-repeat-check' check>
                            <Input
                              type='radio'
                              name='recurrenceEnds'
                              innerRef={register()}
                              value={RecurrenceEndsEnum.After}
                            />
                            <FormattedMessage id='enum.after' defaultMessage='After' />
                          </Label>
                          <InputGroup
                            className={classNames('input-group-merge w-170', {
                              disabled: recurrenceEnds !== RecurrenceEndsEnum.After
                            })}
                          >
                            <Input
                              type='number'
                              min={2}
                              id='recurrenceEndsAfter'
                              name='recurrenceEndsAfter'
                              innerRef={register()}
                              disabled={recurrenceEnds !== RecurrenceEndsEnum.After}
                            />
                            <InputGroupAddon addonType='append'>
                              <InputGroupText>
                                <FormattedMessage id='label.occurrences' defaultMessage='occurrences' />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </FormGroup>
                    </Col>
                  </Col>
                </Row>
              )}
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

export default EditDoctorScheduleModal
