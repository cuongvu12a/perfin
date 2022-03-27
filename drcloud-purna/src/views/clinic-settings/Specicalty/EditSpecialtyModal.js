import { useState, useEffect, Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, Form } from 'reactstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

import Toast from '@utility/toast'
import { createSpecialtyAPI, getSpecialtiesIdAPI, updateSpecialtiesAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import FormError from '@components/FormError'
import Switch from '@components/Switch'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Specialties

const EditSpecialtyModal = ({ open, isEditable, close, handleError403, specialty }) => {
  const EditSpecialtySchema = yup.object().shape({
    specialtyName: yup.string().max(128).required().trim(),
    specialtyShortName: yup.string().max(128).trim()
  })
  const defaultValues = {
    specialtyName: '',
    specialtyShortName: ''
  }
  const { register, formState, handleSubmit, errors, control, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditSpecialtySchema),
    defaultValues
  })

  useEffect(async () => {
    try {
      if (specialty) {
        const result = await getSpecialtiesIdAPI(specialty.specialtyId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            specialtyName: result.data.specialtyName,
            specialtyShortName: result.data.specialtyShortName,
            isEnabled: result.data.isEnabled
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
  }, [specialty, reset])

  const onSubmit = async data => {
    try {
      if (specialty) {
        await updateSpecialtiesAPI(specialty.specialtyId, data, xScreenId)
      } else {
        await createSpecialtyAPI(data, xScreenId)
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
        key='EditSpecialtyModal'
        id='edit-specialty-modal-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {specialty ? (
              <>
                <h2>{specialty.specialtyName}</h2>
                <Switch
                  activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                  deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                  id='isEnabled'
                  name='isEnabled'
                  control={control}
                  disabled={!isEditable}
                />
              </>
            ) : (
              <h2>
                <FormattedMessage id='title.addSpecialty' defaultMessage='Adding Specicalty' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='specialtyName'>
                <FormattedMessage id='label.specialtyName' defaultMessage='Specialty Name' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='specialtyName'
                name='specialtyName'
                autoFocus
                invalid={errors.specialtyName && true}
                innerRef={register()}
                disabled={!isEditable}
              />
              {errors && errors.specialtyName && <FormError>{errors.specialtyName.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label for='specialtyShortName'>
                <FormattedMessage id='label.specialtyShortName' defaultMessage='Specialty short name' />
              </Label>
              <Input
                id='specialtyShortName'
                name='specialtyShortName'
                invalid={errors.specialtyShortName && true}
                innerRef={register()}
                disabled={!isEditable}
              />
              {errors && errors.specialtyShortName && <FormError>{errors.specialtyShortName.message}</FormError>}
            </FormGroup>
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
export default EditSpecialtyModal
