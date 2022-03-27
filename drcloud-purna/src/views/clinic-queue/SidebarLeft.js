import { Fragment, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { CardBody, Button, Col, Label, Row, Form, FormGroup, ListGroup, ListGroupItem } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'

import { arrayToSelectOptions, checkObjectNullable } from '@utility/utils'
import Select from '@components/Select'
import useQuery from '@hooks/useQuery'

const SidebarLeft = ({ onSearch }) => {
  const history = useHistory()
  const location = useLocation()
  const query = useQuery()

  const clinicData = useSelector(state => state.auth.clinicData)

  const defaultValues = {
    locationId: null,
    specialtyId: null,
    doctorId: null
  }
  const { control, handleSubmit, reset, watch, register } = useForm({
    mode: 'onChange',
    defaultValues
  })
  const selectedSpecialtyId = watch('specialtyId')

  useEffect(() => {
    const data = {
      locationId: query.get('locationId') || null,
      specialtyId: query.get('specialtyId') || null,
      doctorId: query.get('doctorId') || null
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
        }`
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
              <Col sm='6'>
                <Button color='primary' type='submit' block onClick={handleSubmit(onSubmit)}>
                  <FormattedMessage id='button.search' defaultMessage='Search' />
                </Button>
              </Col>
              <Col sm='6'>
                <Button color='secondary' outline block onClick={handleResetFilter}>
                  <FormattedMessage id='button.reset' defaultMessage='Reset' />
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>
              <FormattedMessage id='label.note' defaultMessage='Note' />
            </span>
          </h5>
          <ListGroup className='list-group-labels'>
            <ListGroupItem className='d-flex align-items-start'>
              <span className='bullet bullet-sm bullet-primary mr-1'></span>
              <span className='align-middle'>
                <FormattedMessage
                  id='clinicQueue.highPriorityNote'
                  defaultMessage='Patients who book an appointment in advance will be higher priority'
                />
              </span>
            </ListGroupItem>
            <ListGroupItem className='d-flex align-items-start'>
              <span className='bullet bullet-sm bullet-warning mr-1'></span>
              <span className='align-middle'>
                <FormattedMessage id='clinicQueue.lowPriorityNote' defaultMessage='Low Priority' />
              </span>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
      </div>
    </Fragment>
  )
}

export default SidebarLeft
