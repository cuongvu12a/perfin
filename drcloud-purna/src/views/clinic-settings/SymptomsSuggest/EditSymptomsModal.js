import { Fragment, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Button, Input, FormGroup, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap'
import * as yup from 'yup'
import { getErrorMessage } from '@api/handleApiError'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import Toast from '@utility/toast'
import { createSymptomsAPI, updateSymptomAPI, getAllSpecialtyAPI, getSymptomByIdAPI } from '@api/main'
import { arrayToSelectOptions } from '@utility/utils'
import Switch from '@components/Switch'
import FormError from '@components/FormError'
import Select from '@components/Select'
import { FrontEndScreenEnum } from '@utility/constants'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.Symptoms

const EditSymptomsModal = ({ open, isEditable, symptom, close, handleError403 }) => {
  const EditSymptomSchema = yup.object().shape({
    name: yup.string().max(128).required().trim(),
    content: yup.string().max(1024).required().trim()
  })
  const defaultValues = {
    name: '',
    specialtyId: null,
    content: ''
  }
  const { register, formState, reset, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditSymptomSchema),
    defaultValues
  })

  const [specialties, setSpecialties] = useState()

  useEffect(async () => {
    const data = await getAllSpecialtyAPI(xScreenId)
    setSpecialties(data)
    try {
      if (symptom) {
        const newSymptom = await getSymptomByIdAPI(symptom.symptomId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            name: newSymptom.data.name,
            specialtyId: newSymptom.data.specialtyId || null,
            content: newSymptom.data.content,
            isEnabled: newSymptom.data.isEnabled
          }
        })
      } else {
        const firstSpecialtyId = data[0]?.specialtyId
        reset({ ...defaultValues, ...{ specialtyId: firstSpecialtyId } })
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [symptom, reset])

  const onSubmit = async data => {
    try {
      if (symptom) {
        await updateSymptomAPI(symptom.symptomId, data, xScreenId)
      } else {
        await createSymptomsAPI(data, xScreenId)
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
        toggle={close}
        autoFocus={false}
        backdrop='static'
        className='modal-dialog-centered'
        key='SymptomsModal'
        id='symptoms-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {symptom ? (
              <>
                <h2>{symptom.symptomName}</h2>
                <Switch
                  activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                  deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                  name='isEnabled'
                  control={control}
                  disabled={!isEditable}
                />
              </>
            ) : (
              <h2>
                <FormattedMessage id='title.addSymptom' defaultMessage='Add Symptom' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col ms='6'>
                <FormGroup>
                  <Label for='name'>
                    <FormattedMessage id='label.symptomName' defaultMessage='Symptom Name' />
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    autoFocus
                    invalid={errors.name && true}
                    innerRef={register()}
                    disabled={!isEditable}
                  />
                  {errors && errors.name && <FormError>{errors.name.message}</FormError>}
                </FormGroup>
              </Col>
              <Col sm='6'>
                <FormGroup>
                  <Label for='specialty'>
                    <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
                  </Label>
                  <Select
                    id='specialty'
                    name='specialtyId'
                    control={control}
                    options={arrayToSelectOptions(specialties, 'specialtyName', 'specialtyId')}
                    maxMenuHeight={150}
                    isClearable={true}
                    isDisabled={!isEditable}
                  />
                </FormGroup>
              </Col>
              <Col sm='12'>
                <FormGroup>
                  <Label for='Content'>
                    <FormattedMessage id='label.content' defaultMessage='Content' />
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <TextArea
                    id='content'
                    name='content'
                    invalid={errors.content && true}
                    innerRef={register()}
                    disabled={!isEditable}
                    handleSubmit={() => formState.isValid && !formState.isSubmitting && handleSubmit(onSubmit)()}
                  />
                  {errors && errors.content && <FormError>{errors.content.message}</FormError>}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {(!formState.isDirty || !isEditable) && (
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}
            {formState.isDirty && isEditable && (
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
        </Form>
      </Modal>
    </Fragment>
  )
}

export default EditSymptomsModal
