import { Fragment, useEffect, memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { CardBody, Button, Col, Label, Row, Form, FormGroup, Input } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { endOfDay, startOfDay, startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { AppointmentStatusEnum } from '@utility/constants'
import { arrayToSelectOptions, enumToSelectOptions } from '@utility/utils'
import { Can } from '@utility/context/Can'
import DateRangePicker from '@components/DateRangePicker'
import Select from '@components/Select'
import useQuery from '@hooks/useQuery'

const SidebarLeft = ({ onAddClick, onSearch }) => {
  const history = useHistory()
  const location = useLocation()
  const query = useQuery()
  const intl = useIntl()

  const clinicData = useSelector(state => state.auth.clinicData)

  const defaultStartDate = startOfDay(new Date())
  const defaultEndDate = endOfDay(addDays(new Date(), clinicData.allowBookingInDays))

  const defaultValues = {
    locationId: null,
    specialtyId: null,
    doctorId: null,
    keyword: '',
    appointmentCode: null,
    appointmentStatusId: null,
    dateRange: {
      startDate: defaultStartDate,
      endDate: defaultEndDate
    }
  }
  const sidebarLeftSchema = yup.object().shape({
    keyword: yup.string().trim()
  })
  const { control, handleSubmit, reset, watch, register } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(sidebarLeftSchema)
  })
  const selectedSpecialtyId = watch('specialtyId')

  useEffect(() => {
    const startTimestamp = Date.parse(query.get('fromDate'))
    const endTimestamp = Date.parse(query.get('toDate'))
    const data = {
      locationId: query.get('locationId') || null,
      specialtyId: query.get('specialtyId') || null,
      doctorId: query.get('doctorId') || null,
      keyword: decodeURI(query.get('keyword') || ''),
      appointmentCode: query.get('appointmentCode') || null,
      appointmentStatusId: Number(query.get('appointmentStatusId')) || null,
      dateRange: {
        startDate: isNaN(startTimestamp) ? defaultStartDate : startOfDay(new Date(startTimestamp)),
        endDate: isNaN(endTimestamp) ? defaultEndDate : endOfDay(new Date(endTimestamp))
      }
    }
    reset(data)
    if (!!onSearch) {
      onSearch({
        locationId: data.locationId,
        specialtyId: data.specialtyId,
        doctorId: data.doctorId,
        keyword: data.keyword,
        appointmentCode: data.appointmentCode,
        appointmentStatusId: data.appointmentStatusId,
        fromDate: data.dateRange.startDate.getTime(),
        toDate: data.dateRange.endDate.getTime()
      })
    }
  }, [])

  const onSubmit = data => {
    if (!!onSearch) {
      onSearch({
        locationId: data.locationId,
        specialtyId: data.specialtyId,
        doctorId: data.doctorId,
        keyword: data.keyword,
        appointmentCode: data.appointmentCode,
        appointmentStatusId: data.appointmentStatusId,
        fromDate: data.dateRange.startDate.getTime(),
        toDate: data.dateRange.endDate.getTime()
      })
    }

    if (!_.isEqual(data, defaultValues)) {
      history.push({
        pathname: location.pathname,
        search: `?locationId=${data.locationId || ''}&specialtyId=${data.specialtyId || ''}&doctorId=${
          data.doctorId || ''
        }&keyword=${encodeURI(data.keyword)}&appointmentCode=${data.appointmentCode || ''}&appointmentStatusId=${
          data.appointmentStatusId || ''
        }&fromDate=${format(data.dateRange.startDate, 'yyyy-MM-dd')}&toDate=${format(
          data.dateRange.endDate,
          'yyyy-MM-dd'
        )}` // add appointmentCode in url query
      })
    } else {
      history.push(location.pathname)
    }
  }

  const handleResetFilter = () => {
    reset(defaultValues)
    if (!!onSearch) {
      onSearch({
        locationId: defaultValues.locationId,
        specialtyId: defaultValues.specialtyId,
        doctorId: defaultValues.doctorId,
        keyword: defaultValues.keyword,
        appointmentCode: defaultValues.appointmentCode,
        appointmentStatusId: defaultValues.appointmentStatusId,
        fromDate: defaultValues.dateRange.startDate.getTime(),
        toDate: defaultValues.dateRange.endDate.getTime()
      })
    }

    history.push(location.pathname)
  }

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <Can I={'write' || 'add'} a='appointments'>
          <CardBody className='card-body d-flex justify-content-center my-sm-0'>
            <Button color='primary' block onClick={onAddClick}>
              <span className='align-middle'>
                <FormattedMessage id='button.addAppointment' defaultMessage='Add Appointment' />
              </span>
            </Button>
          </CardBody>
        </Can>

        <CardBody>
          <Form>
            <h5 className='section-label mb-1'>
              <span className='align-middle'>
                <FormattedMessage id='label.filter' defaultMessage='Filter' />
              </span>
            </h5>
            <Row>
              <Col sm='12'>
                <FormGroup>
                  <Label for='dateRange'>
                    <FormattedMessage id='label.dateRange' defaultMessage='Date Range' />
                  </Label>
                  <Controller
                    name='dateRange'
                    control={control}
                    render={({ value, onChange }) => (
                      <DateRangePicker id='dateRange' value={value} onChange={onChange} autoFocus />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='location'>
                    <FormattedMessage id='label.location' defaultMessage='Location' />
                  </Label>
                  <Select
                    name='locationId'
                    control={control}
                    options={arrayToSelectOptions(clinicData.locations, 'locationName', 'locationId')}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='specialty'>
                    <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
                  </Label>
                  <Select
                    name='specialtyId'
                    control={control}
                    options={arrayToSelectOptions(clinicData.specialties, 'specialtyName', 'specialtyId')}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='doctor'>
                    <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
                  </Label>
                  <Select
                    name='doctorId'
                    control={control}
                    options={arrayToSelectOptions(
                      clinicData.doctors.filter(
                        d => !d.specialtyId || !selectedSpecialtyId || d.specialtyId === selectedSpecialtyId
                      ),
                      'doctorName',
                      'doctorId'
                    )}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='appointmentStatusId'>
                    <FormattedMessage id='label.status' defaultMessage='Status' />
                  </Label>
                  <Select
                    name='appointmentStatusId'
                    control={control}
                    options={enumToSelectOptions(AppointmentStatusEnum)}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                    getOptionLabel={option => (
                      <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='appointmentCode'>
                    <FormattedMessage id='label.appointmentCode' defaultMessage='Appointment Code' />
                  </Label>
                  <Input id='appointmentCode' name='appointmentCode' innerRef={register({ valueAsNumber: true })} />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='keyword'>
                    <FormattedMessage id='label.keyword' defaultMessage='Keyword' />
                  </Label>
                  <Input
                    id='keyword'
                    name='keyword'
                    className='input-placeholder'
                    innerRef={register()}
                    placeholder={intl.formatMessage({ id: 'placeholder.appointmentKeyword' })}
                  />
                </FormGroup>
              </Col>
              <Col xs='6'>
                <Button color='primary' type='submit' block onClick={handleSubmit(onSubmit)}>
                  <FormattedMessage id='button.search' defaultMessage='Search' />
                </Button>
              </Col>
              <Col xs='6'>
                <Button color='secondary' outline block onClick={handleResetFilter}>
                  <FormattedMessage id='button.reset' defaultMessage='Reset' />
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </div>
    </Fragment>
  )
}

export default memo(SidebarLeft)
