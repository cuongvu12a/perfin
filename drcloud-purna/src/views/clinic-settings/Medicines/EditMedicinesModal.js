import { Fragment, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, Form } from 'reactstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

import Toast from '@utility/toast'
import { FrontEndScreenEnum } from '@utility/constants'
import FormError from '@components/FormError'
import { getErrorMessage } from '@api/handleApiError'
import { createMedicineAPI, updateMedicineAPI } from '@api/main'

const xScreenId = FrontEndScreenEnum.Medicines

const EditMedicinesModal = ({ open, close, handleError403, medicine, isEditable }) => {
  const EditMedicineSchema = yup.object().shape({
    medicineNames: yup
      .array()
      .transform((value, originalValue) => {
        if (yup.mixed().isType(value) && value !== null) {
          return value
        }
        return originalValue ? originalValue.replace(/^\s+|\s+$/gm, '').split(',') : []
      })
      .of(yup.string().trim())
      .max(20)
      .min(1)
  })

  const defaultValues = {
    medicineNames: ''
  }

  const { register, formState, handleSubmit, errors, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditMedicineSchema),
    defaultValues
  })

  useEffect(() => {
    if (medicine) {
      reset({
        ...defaultValues,
        ...{
          medicineNames: medicine.medicineName
        }
      })
    }
  }, [medicine, reset])

  const onSubmit = async data => {
    const medicines = data.medicineNames.filter(name => name !== '')
    try {
      if (medicine) {
        await updateMedicineAPI(medicine.medicineId, { medicineName: medicines.toString() }, xScreenId)
      } else {
        await createMedicineAPI({ medicineNames: medicines }, xScreenId)
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
        key='EditMedicineModal'
        id='edit-medicine-modal-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {medicine ? (
              <h2>
                <FormattedMessage id='title.editingMedicine' defaultMessage='Editing Medicine' />
              </h2>
            ) : (
              <h2>
                <FormattedMessage id='title.addingMedicine' defaultMessage='Adding Medicine' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody className='clinic-settings'>
            <FormGroup>
              <Label for='medicineNames'>
                <FormattedMessage id='label.medicineName' defaultMessage='Medicine Name' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='medicineNames'
                name='medicineNames'
                autoFocus
                invalid={errors.medicineNames && true}
                innerRef={register()}
                disabled={(!!medicine && !medicine?.isEditable) || !isEditable}
              />
              {errors && errors.medicineNames && (
                <FormError>
                  {Array.isArray(errors.medicineNames)
                    ? errors.medicineNames[errors.medicineNames.length - 1].message
                    : errors.medicineNames.message}
                </FormError>
              )}
              {!medicine && (
                <div className='description-text'>
                  <FormattedMessage
                    id='medicines.descriptionForMedicines'
                    defaultMessage='Separate medicine with commas to add multiple medicines at once (at most 20 medicines)'
                  />
                </div>
              )}
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

export default EditMedicinesModal
