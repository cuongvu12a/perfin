import { Fragment, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import debounce from 'lodash.debounce'

import { getErrorMessage } from '@api/handleApiError'
import { getPropertyByIdAPI, createPropertyAPI, updatePropertyAPI } from '@api/main'
import { enumToSelectOptions } from '@utility/utils'
import Select from '@components/Select'
import Toast from '@utility/toast'
import { FrontEndScreenEnum, EntityTypeEnum, PropertyValueTypeEnum } from '@utility/constants'
import FormError from '@components/FormError'
import TextArea from '@components/TextArea'

const xScreenId = FrontEndScreenEnum.Properties

const EditPropertiesModal = ({ open, close, handleError403, property, isEditable }) => {
  const [selectedPropertyValueTypeId, setSelectedPropertyTypeId] = useState()

  const defaultValues = {
    entityTypeId: EntityTypeEnum.ResultSheet,
    propertyValueTypeId: PropertyValueTypeEnum.FreeText,
    propertyName: '',
    propertyInternalName: '',
    listOfOptions: ''
  }

  const EditPropertySchema = yup.object().shape({
    propertyName: yup.string().max(128).required().trim(),
    listOfOptions: yup.string().when('propertyValueTypeId', {
      is: propertyValueTypeId => {
        return propertyValueTypeId === PropertyValueTypeEnum.ListOfOptions
      },
      then: yup.string().required().trim()
    })
  })

  const { register, formState, handleSubmit, control, watch, reset, errors, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditPropertySchema),
    defaultValues
  })

  const propertyValueTypeId = watch('propertyValueTypeId')
  const propertyInternalNameValue = watch('propertyInternalName')

  useEffect(async () => {
    try {
      if (property) {
        const res = await getPropertyByIdAPI(property.propertyId, xScreenId)
        setSelectedPropertyTypeId(res.data.propertyValueTypeId)
        reset({
          ...defaultValues,
          ...{
            entityTypeId: res.data.entityTypeId,
            propertyValueTypeId: res.data.propertyValueTypeId,
            propertyName: res.data.propertyName,
            propertyInternalName: res.data.propertyInternalName,
            ...(res.data.propertyValueTypeId === PropertyValueTypeEnum.ListOfOptions && {
              listOfOptions: res.data.propertyValueTypeDetail.listOfOptions.toString().replaceAll(',', '\n')
            })
          }
        })
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [property, reset])

  const handleAddInternalName = useCallback(
    debounce(name => {
      const convertedName = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^\w ]+/g, '_')
        .trim()
        .replace(/ +/g, '_')
      setValue('propertyInternalName', convertedName)
    }, 400),
    []
  )

  const handleFilterPropertyValueType = () => {
    if (property) {
      if (
        selectedPropertyValueTypeId === PropertyValueTypeEnum.ListOfOptions ||
        selectedPropertyValueTypeId === PropertyValueTypeEnum.FreeText
      ) {
        return enumToSelectOptions(PropertyValueTypeEnum).filter(
          p => p.value === PropertyValueTypeEnum.ListOfOptions || p.value === PropertyValueTypeEnum.FreeText
        )
      }
      return enumToSelectOptions(PropertyValueTypeEnum).filter(
        p => p.value === PropertyValueTypeEnum.Date || p.value === PropertyValueTypeEnum.DateTime
      )
    } else {
      return enumToSelectOptions(PropertyValueTypeEnum)
    }
  }

  const onSubmit = async data => {
    const optionsList = data?.listOfOptions?.split('\n').filter(op => op !== '')

    const newData = {
      entityTypeId: data.entityTypeId,
      propertyName: data.propertyName,
      propertyValueTypeId: data.propertyValueTypeId,
      propertyInternalName: propertyInternalNameValue,
      propertyValueTypeDetail: {
        ...(propertyValueTypeId === PropertyValueTypeEnum.ListOfOptions && { listOfOptions: optionsList })
      }
    }

    delete data.propertyInternalName
    try {
      if (property) {
        await updatePropertyAPI(property.propertyId, newData, xScreenId)
      } else {
        await createPropertyAPI(newData, xScreenId)
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
        key='EditPropertyModal'
        id='edit-property-modal'
      >
        <Form className='clinic-settings'>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {!property ? (
              <h2 className='mb-0'>
                <FormattedMessage id='title.addingProperty' defaultMessage='Adding Property' />
              </h2>
            ) : (
              <h2 className='mb-0'>
                <FormattedMessage id='title.editingProperty' defaultMessage='Editing Property' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody className='property '>
            <Row>
              <Col sm='6'>
                <FormGroup>
                  <Label for='entityTypeId'>
                    <FormattedMessage id='label.propertyEntity' defaultMessage='Property Entity' />
                  </Label>
                  <Select
                    id='entityTypeId'
                    name='entityTypeId'
                    control={control}
                    autoFocus
                    options={enumToSelectOptions(EntityTypeEnum)}
                    getOptionLabel={option => (
                      <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                    )}
                    isDisabled={!!property || !isEditable}
                  />
                </FormGroup>
              </Col>
              <Col sm='6'>
                <FormGroup>
                  <Label for='propertyType'>
                    <FormattedMessage id='label.propertyType' defaultMessage='Property Type' />
                  </Label>
                  <Select
                    id='propertyValueTypeId'
                    name='propertyValueTypeId'
                    control={control}
                    options={handleFilterPropertyValueType()}
                    getOptionLabel={option => (
                      <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                    )}
                    isDisabled={(!!property && !property?.isEditable) || !isEditable}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for='propertyName'>
                <FormattedMessage id='label.propertyName' defaultMessage='Property Name' />
              </Label>
              <span className='text-danger'>&nbsp;*</span>
              <Input
                id='propertyName'
                name='propertyName'
                innerRef={register()}
                invalid={errors.propertyName && true}
                onChange={e => (!property ? handleAddInternalName(e.target.value) : {})}
                disabled={(!!property && !property?.isEditable) || !isEditable}
              />
              {errors && errors.propertyName && <FormError>{errors.propertyName.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label for='propertyInternalName'>
                <FormattedMessage id='label.propertyInternalName' defaultMessage='Internal Name' />
              </Label>
              <Input id='propertyInternalName' name='propertyInternalName' disabled={true} innerRef={register()} />
            </FormGroup>

            {propertyValueTypeId === PropertyValueTypeEnum.ListOfOptions ? (
              <FormGroup>
                <Label for='listOfOptions'>
                  <FormattedMessage id='label.options' defaultMessage='Options' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <TextArea
                  id='listOfOptions'
                  name='listOfOptions'
                  rows='5'
                  invalid={errors.listOfOptions && true}
                  innerRef={register()}
                  disabled={(!!property && !property?.isEditable) || !isEditable}
                  handleSubmit={() => formState.isValid && !formState.isSubmitting && handleSubmit(onSubmit)()}
                />
                {errors && errors.listOfOptions && <FormError>{errors.listOfOptions.message}</FormError>}
                <div className='description-text'>
                  <FormattedMessage id='property.descriptionForOptions' defaultMessage='* One option per row.' />
                </div>
              </FormGroup>
            ) : null}
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

export default EditPropertiesModal
