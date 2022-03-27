import { Fragment, useEffect, useState } from 'react'
import { Label, Input, FormGroup, Row, Col, Button } from 'reactstrap'
import { ArrowRight } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import { useForm } from 'react-hook-form'
import { default as SelectForm } from 'react-select'

import { FrontEndScreenEnum, EntityTypeEnum } from '@utility/constants'
import { getAllFormsByEntityTypeAPI, getFormPropertiesAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import Toast from '@utility/toast'
import { reversePropertyObject } from '@utility/utils'

import DateTimePicker from '@components/DateTimePicker'
import PropertyInput from '@components/PropertyInput'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const ExaminationResult = ({ step, appointmentDetail, handleError403, setExaminationResultData }) => {
  const [forms, setForms] = useState([])
  const [propertyList, setPropertyList] = useState([])

  // state value
  const [symptomValue, setSymptomValue] = useState(appointmentDetail.symptom)
  const [formId, setFormId] = useState('')
  const [resultValue, setResultValue] = useState('')
  const [reExaminationDateValue, setReExaminationDateValue] = useState()

  const { handleSubmit, control } = useForm({})

  useEffect(async () => {
    try {
      const formRes = await getAllFormsByEntityTypeAPI(EntityTypeEnum.ResultSheet, xScreenId)
      setForms(formRes.data)
      setFormId(formRes.data[0]?.formId)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [])

  useEffect(async () => {
    if (!!formId) {
      try {
        const propertyRes = await getFormPropertiesAPI(formId, xScreenId)
        setPropertyList(propertyRes.data)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        } else {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      }
    } else {
      setPropertyList([])
    }
  }, [formId])

  const handleFormChanged = value => {
    setFormId(value.formId)
  }

  const EntitySelectColourStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? 'show' : 'none',
      border: state.isFocused ? 'show' : 'none'
    })
  }

  const onSubmit = data => {
    const formName = forms.find(el => el.formId === formId).formName
    const printTemplateId = forms.find(el => el.formId === formId).printTemplateId
    const newData = {
      formName,
      formId,
      symptom: symptomValue,
      result: resultValue,
      reExaminationDate: !!reExaminationDateValue ? reExaminationDateValue.getTime() : null,
      properties: data,
      propertyList,
      printTemplateId
    }
    setExaminationResultData(newData)
    step.next()
  }

  const handleSubmitForm = () => resultValue && symptomValue && formId && handleSubmit(onSubmit)()

  return (
    <Fragment>
      <div className='right-side-content'>
        <div className='right-side-body'>
          <section title='symptom'>
            <div className='content-header'>
              <h4 className='mb-0'>
                <FormattedMessage id='label.symptom' defaultMessage='Symptom' />
                <span className='text-danger'>&nbsp;*</span>
              </h4>
            </div>
            <Row>
              <Col sm='12'>
                <FormGroup>
                  <TextArea
                    name='symptom'
                    id='symptom'
                    value={symptomValue}
                    onChange={e => setSymptomValue(e.target.value)}
                    autoFocus
                    handleSubmit={handleSubmitForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </section>

          <section title='examinationDetails'>
            <div className='content-header'>
              <Row className='d-flex align-items-center px-1'>
                <h4 className='mb-0 mr-1'>
                  <FormattedMessage id='label.examinationDetails' defaultMessage='Examination Details' />
                  <span className='text-danger'>&nbsp;*</span>
                </h4>

                <Col sm='2' className='p-0'>
                  <SelectForm
                    styles={EntitySelectColourStyles}
                    className='react-select'
                    classNamePrefix='select'
                    maxMenuHeight={150}
                    isClearable={false}
                    placeholder={<FormattedMessage id='placeholder.selectForm' defaultMessage='Select a form...' />}
                    getOptionLabel={op => op.formName}
                    getOptionValue={op => op.formId}
                    value={forms.find(op => op.formId === formId) || forms[0]}
                    options={forms}
                    onChange={handleFormChanged}
                  />
                </Col>
              </Row>
            </div>
            {/* Render Props Part */}
            <Row>
              {propertyList.map((prop, index) => (
                <Col sm='6' key={index}>
                  <PropertyInput prop={prop} control={control} />
                </Col>
              ))}
            </Row>
          </section>
          <section title='result'>
            <div className='content-header'>
              <h4 className='mb-0'>
                <FormattedMessage id='label.result' defaultMessage='Result' />
                <span className='text-danger'>&nbsp;*</span>
              </h4>
            </div>
            <Row>
              <Col sm='12'>
                <FormGroup>
                  <TextArea
                    name='result'
                    id='result'
                    onChange={e => setResultValue(e.target.value)}
                    value={resultValue}
                    handleSubmit={handleSubmitForm}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <FormGroup>
                  <Label for='reExaminationDate'>
                    <FormattedMessage id='label.reexaminationDate' defaultMessage='Re-examination Date' />
                  </Label>
                  <DateTimePicker
                    id='reExaminationDate'
                    value={reExaminationDateValue}
                    onChange={date => {
                      setReExaminationDateValue(...date)
                    }}
                    options={{
                      minDate: 'today'
                    }}
                    isClearable={true}
                  />
                </FormGroup>
              </Col>
            </Row>
          </section>
        </div>
      </div>

      <div className='right-side-footer justify-content-end'>
        <Button color='primary' onClick={handleSubmitForm} disabled={!(resultValue && symptomValue && formId)}>
          <FormattedMessage id='button.next' defaultMessage='Next' />
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button>
      </div>
    </Fragment>
  )
}

export default ExaminationResult
