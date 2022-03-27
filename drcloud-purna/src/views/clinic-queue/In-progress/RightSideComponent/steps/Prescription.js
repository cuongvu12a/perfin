import { Fragment, useRef, useState } from 'react'
import { Form, Label, Input, FormGroup, Row, Col, Button } from 'reactstrap'
import { ArrowLeft, ArrowRight, Trash2, Edit, Plus, Check } from 'react-feather'
import AsyncSelect from 'react-select/async'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { enumToSelectOptions, selectThemeColors, arrayToSelectOptions, reverseEnumObject } from '@utility/utils'
import { FormattedMessage, useIntl } from 'react-intl'

import Select from '@components/Select'
import { FrontEndScreenEnum, KeyBoardEnum, MedicineUnitTypeEnum } from '@utility/constants'
import { getAllMedicinesAPI } from '@api/main'
import Toast from '@utility/toast'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const Prescription = ({ step, handleError403, setPrescriptionData, handleStepFinal }) => {
  const preScriptionSchema = yup.object().shape({
    medicine: yup.object().required(),
    amount: yup.number().min(1),
    usage: yup.string().required()
  })
  const intl = useIntl()

  const [medicineList, setMedicineList] = useState([])
  const [noteValue, setNoteValue] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  // Refs
  const asyncSelectRef = useRef()

  const defaultValues = {
    medicine: null,
    amount: 0,
    unitTypeEnum: 1,
    usage: ''
  }

  const { register, errors, handleSubmit, control, formState, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(preScriptionSchema),
    defaultValues
  })

  const loadMedicines = async keyword => {
    try {
      const response = await getAllMedicinesAPI(keyword, xScreenId)
      return arrayToSelectOptions(response, 'medicineName', 'medicineId')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const onAddMedicine = data => {
    asyncSelectRef.current.focus()
    const newData = {
      amount: data.amount,
      medicine: {
        medicineName: data.medicine.label,
        medicineId: data.medicine.value
      },
      unitTypeEnum: data.unitTypeEnum,
      usage: data.usage
    }
    const checkDuplicate = obj => obj.medicine.medicineId === newData.medicine.medicineId
    if (!medicineList.some(checkDuplicate)) {
      setMedicineList([...medicineList, newData])
    } else {
      Toast.showWarning('toast.warning', 'toast.duplicateMedicine')
    }
    setIsEditMode(false)
    reset(defaultValues)
  }

  const handleFinalSubmit = () => {
    const data = {
      note: noteValue,
      medicines: medicineList
    }

    setPrescriptionData(data)
    handleStepFinal()
    step.next()
  }

  const handleDelete = med => {
    const newList = medicineList.filter(m => m.medicine.medicineId !== med.medicine.medicineId)
    setMedicineList(newList)
  }

  const handleEditMedicine = med => {
    handleDelete(med)
    setIsEditMode(true)
    reset({
      amount: med.amount,
      medicine: {
        label: med.medicine.medicineName,
        value: med.medicine.medicineId
      },
      unitTypeEnum: med.unitTypeEnum,
      usage: med.usage
    })
  }

  return (
    <Fragment>
      <div className='right-side-content'>
        <div className='right-side-body d-flex flex-column justify-content-between align-content-end'>
          <div>
            <Form onSubmit={handleSubmit(onAddMedicine)}>
              <Row>
                <Col sm='4'>
                  <FormGroup className='mb-0'>
                    <Controller
                      name='medicine'
                      control={control}
                      render={({ onChange, value }) => (
                        <AsyncSelect
                          id='async-select'
                          theme={selectThemeColors}
                          className='react-select'
                          classNamePrefix='select'
                          defaultOptions
                          maxMenuHeight={150}
                          isClearable={true}
                          styles={{
                            valueContainer: (provided, state) => ({
                              ...provided,
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            })
                          }}
                          placeholder={intl.formatMessage({ id: 'placeholder.medicineName' })}
                          loadOptions={loadMedicines}
                          onChange={val => onChange(val)}
                          value={value}
                          ref={asyncSelectRef}
                        />
                      )}
                    />
                  </FormGroup>
                </Col>
                <Col sm='3'>
                  <Row>
                    <Col sm='6'>
                      <Input
                        type='number'
                        name='amount'
                        id='ammount'
                        innerRef={register({ valueAsNumber: true })}
                        invalid={errors.amount && true}
                        placeholder={intl.formatMessage({ id: 'placeholder.amount' })}
                      />
                    </Col>
                    <Col sm='6'>
                      <Select
                        name='unitTypeEnum'
                        control={control}
                        options={enumToSelectOptions(MedicineUnitTypeEnum)}
                        getOptionLabel={option => (
                          <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                        )}
                        placeholder={intl.formatMessage({ id: 'placeholder.unit' })}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col sm='4'>
                  <Input
                    name='usage'
                    id='usage'
                    innerRef={register()}
                    invalid={errors.usage && true}
                    placeholder={intl.formatMessage({ id: 'placeholder.usage' })}
                  />
                </Col>
                <Col sm='1'>
                  {isEditMode ? (
                    <Button color='primary' className='custom-add-button' disabled={!formState.isValid}>
                      <Check size={22} />
                    </Button>
                  ) : (
                    <Button color='primary' className='custom-add-button' disabled={!formState.isValid}>
                      <Plus size={22} />
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
            <hr className='mb-0' />

            {/* render section */}
            <FormGroup className='react-dataTable '>
              {medicineList.map((m, index) => (
                <div key={index}>
                  <Row>
                    <Col sm='4'>
                      <div className='table-cell p-0'>
                        <h6 className='mb-0'>{`${index + 1}.`}</h6>
                        <h6 className='mb-0 ml-25 appointment-table-cell '>{m.medicine?.medicineName}</h6>
                      </div>
                    </Col>
                    <Col sm='3'>
                      <div className='table-cell p-0'>
                        <h6 className='mb-0 appointment-table-cell '>
                          {m.amount}{' '}
                          <FormattedMessage
                            id={`enum.${reverseEnumObject(MedicineUnitTypeEnum)[m.unitTypeEnum]}`}
                            defaultMessage={reverseEnumObject(MedicineUnitTypeEnum)[m.unitTypeEnum]}
                          />
                        </h6>
                      </div>
                    </Col>

                    <Col sm='4'>
                      <div className='table-cell p-0'>
                        <h6 className='mb-0 appointment-table-cell '>{m.usage}</h6>
                      </div>
                    </Col>
                    <Col sm='1'>
                      <div className='table-cell d-flex p-0'>
                        <Edit size={15} className='icon-button' onClick={() => handleEditMedicine(m)} />
                        <Trash2
                          id='delete-button'
                          size={15}
                          className='icon-button ml-50'
                          focusable={true}
                          onClick={() => handleDelete(m)}
                        />
                      </div>
                    </Col>
                  </Row>
                  <hr className='mt-0 mb-0' />
                </div>
              ))}
            </FormGroup>
          </div>
          <div>
            <Row>
              <Col sm='12'>
                <FormGroup>
                  <Label for='note'>
                    <FormattedMessage id='label.note1' defaultMessage='Note' />
                  </Label>
                  <Input name='note' id='note' value={noteValue} onChange={e => setNoteValue(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className='right-side-footer'>
        <Button color='primary' outline onClick={() => step.previous()}>
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <FormattedMessage id='button.previous' defaultMessage='Previous' />
        </Button>
        <Button color='primary' onClick={handleFinalSubmit}>
          <FormattedMessage id='button.next' defaultMessage='Next' />
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button>
      </div>
    </Fragment>
  )
}

export default Prescription
