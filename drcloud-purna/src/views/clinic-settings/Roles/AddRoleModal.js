import { Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, Form } from 'reactstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

import FormError from '@components/FormError'

const AddRoleModal = ({ open, close, openEditModal }) => {
  const AddRoleSchema = yup.object().shape({
    roleName: yup.string().max(128).required().trim()
  })
  const defaultValues = {
    roleName: ''
  }
  const { register, formState, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(AddRoleSchema),
    defaultValues
  })
  const onSubmit = async data => {
    close()
    openEditModal(data)
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
            <h2>
              <FormattedMessage id='title.addRole' defaultMessage='Adding Role' />
            </h2>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='roleName'>
                <FormattedMessage id='label.roleName' defaultMessage='Role Name' />
              </Label>
              <Input id='roleName' name='roleName' autoFocus invalid={errors.roleName && true} innerRef={register()} />
              {errors && errors.roleName && <FormError>{errors.roleName.message}</FormError>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!formState.isDirty && (
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}
            {formState.isDirty && (
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
                  <FormattedMessage id='button.continue' defaultMessage='Continue' />
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default AddRoleModal
