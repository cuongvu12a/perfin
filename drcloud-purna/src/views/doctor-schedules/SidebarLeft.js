import { Fragment, useEffect, memo, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { CardBody, Button, Col, Label, Row, Form, FormGroup, Input } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { arrayToSelectOptions, checkObjectNullable } from '@utility/utils'
import Select from '@components/Select'
import useQuery from '@hooks/useQuery'

import illustration from '@assets/images/banner/calendar-illustration.png'
import { Can } from '@utility/context/Can'

const SidebarLeft = ({ onAddClick, onSearch }) => {
  const history = useHistory()
  const location = useLocation()
  const query = useQuery()
  const intl = useIntl()

  const clinicData = useSelector(state => state.auth.clinicData)

  const defaultValues = {
    locationId: null,
    specialtyId: null,
    doctorId: null,
    keyword: ''
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
    const data = {
      locationId: query.get('locationId') || null,
      specialtyId: query.get('specialtyId') || null,
      doctorId: query.get('doctorId') || null,
      keyword: decodeURI(query.get('keyword') || '')
    }
    reset(data)
    if (!!onSearch && !checkObjectNullable(data)) onSearch(data)
  }, [])

  const onSubmit = data => {
    if (!!onSearch) onSearch(data)
    if (!_.isEqual(data, defaultValues)) {
      history.push({
        pathname: location.pathname,
        search: `?locationId=${data.locationId || ''}&specialtyId=${data.specialtyId || ''}&doctorId=${
          data.doctorId || ''
        }&keyword=${encodeURI(data.keyword || '')}`
      })
    } else {
      history.push(location.pathname)
    }
  }

  const handleResetFilter = () => {
    reset(defaultValues)
    if (!!onSearch) onSearch(defaultValues)

    history.push(location.pathname)
  }

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <Can I='write' a='doctorSchedules'>
          <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
            <Button color='primary' block onClick={onAddClick}>
              <span className='align-middle'>
                <FormattedMessage id='button.addDoctorSchedule' defaultMessage='Add Schedule' />
              </span>
            </Button>
          </CardBody>
        </Can>

        <CardBody className='scrollbar-container'>
          <Form>
            <h5 className='section-label mb-1'>
              <span className='align-middle'>
                <FormattedMessage id='label.filter' defaultMessage='Filter' />
              </span>
            </h5>
            <Row>
              <Col sm='12'>
                <FormGroup>
                  <Label for='location'>
                    <FormattedMessage id='label.location' defaultMessage='Location' />
                  </Label>
                  <Select
                    name='locationId'
                    autoFocus
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
                  <Label for='keyword'>
                    <FormattedMessage id='label.keyword' defaultMessage='Keyword' />
                  </Label>
                  <Input
                    id='keyword'
                    name='keyword'
                    innerRef={register()}
                    placeholder={intl.formatMessage({ id: 'placeholder.doctorScheduleKeyword' })}
                  />
                </FormGroup>
              </Col>
              <Col sm='6'>
                <Button color='primary' type='submit' block className='mb-1' onClick={handleSubmit(onSubmit)}>
                  <FormattedMessage id='button.search' defaultMessage='Search' />
                </Button>
              </Col>
              <Col sm='6'>
                <Button color='secondary' outline block className='mb-1' onClick={handleResetFilter}>
                  <FormattedMessage id='button.reset' defaultMessage='Reset' />
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </div>
      <div className='mt-auto'>
        <img className='img-fluid' src={illustration} alt='illustration' />
      </div>
    </Fragment>
  )
}

export default memo(SidebarLeft)
