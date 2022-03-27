import { Fragment, useEffect, memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { CardBody, Button, Col, Label, Row, Form, FormGroup, Input } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { GenderEnum, FrontEndScreenEnum, ScreenEnum } from '@utility/constants'
import { enumToSelectOptions } from '@utility/utils'
import Select from '@components/Select'
import useQuery from '@hooks/useQuery'
import { Can } from '@utility/context/Can'

const SidebarLeft = ({ onAddClick, onSearch }) => {
  const history = useHistory()
  const location = useLocation()
  const query = useQuery()
  const intl = useIntl()

  const defaultValues = {
    keyword: '',
    patientCode: '',
    yearOfBirth: 0,
    gender: null
  }
  const sidebarLeftSchema = yup.object().shape({
    keyword: yup.string().trim()
  })
  const { control, handleSubmit, reset, register } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(sidebarLeftSchema)
  })

  const handleGenerateYears = (startYear, endYear) => {
    return Array(endYear - startYear + 1)
      .fill()
      .map((_, index) => {
        return {
          label: startYear + index,
          value: startYear + index
        }
      })
      .reverse()
  }

  useEffect(() => {
    const data = {
      keyword: decodeURI(query.get('keyword') || ''),
      patientCode: query.get('patientCode') || '',
      yearOfBirth: Number(query.get('yearOfBirth')) || 0,
      gender: Number(query.get('gender')) || null
    }
    reset(data)
    if (!!onSearch) onSearch(data)
  }, [])

  const onSubmit = data => {
    if (!!onSearch) onSearch(data)
    if (!_.isEqual(data, defaultValues)) {
      history.push({
        pathname: location.pathname,
        search: `?keyword=${encodeURI(data.keyword || '')}&patientCode=${data.patientCode || ''}&yearOfBirth=${
          data.yearOfBirth || ''
        }&gender=${data.gender || ''}`
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
        <Can I='write' a={ScreenEnum[FrontEndScreenEnum.Contacts]}>
          <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
            <Button color='primary' block onClick={onAddClick}>
              <span className='align-middle'>
                <FormattedMessage id='button.addPatient' defaultMessage='Add Patient' />
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
                  <Label for='keyword'>
                    <FormattedMessage id='label.keyword' defaultMessage='Keyword' />
                  </Label>
                  <Input
                    id='keyword'
                    name='keyword'
                    innerRef={register()}
                    autoFocus
                    placeholder={intl.formatMessage({ id: 'placeholder.contactInfoKeyword' })}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='patientCode'>
                    <FormattedMessage id='label.patientCode' defaultMessage='Patient Code' />
                  </Label>
                  <Input id='patientCode' name='patientCode' innerRef={register()} />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='yearOfBirth'>
                    <FormattedMessage id='label.yearOfBirth' defaultMessage='Year of Birth' />
                  </Label>
                  <Select
                    name='yearOfBirth'
                    control={control}
                    options={handleGenerateYears(1920, new Date().getFullYear())}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='gender'>
                    <FormattedMessage id='label.gender' defaultMessage='Gender' />
                  </Label>
                  <Select
                    name='gender'
                    control={control}
                    options={enumToSelectOptions(GenderEnum)}
                    isClearable={true}
                    placeholder={<FormattedMessage id='placeholder.all' defaultMessage='All' />}
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
    </Fragment>
  )
}

export default memo(SidebarLeft)
