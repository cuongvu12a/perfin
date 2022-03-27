import { Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, Form } from 'reactstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

import FormError from '@components/FormError'

const AddUserGroupModal = ({ open, close, openEditModal }) => {
  const AddUserGroupsSchema = yup.object().shape({
    userGroupName: yup.string().max(128).required().trim()
  })
  const defaultValues = {
    userGroupName: ''
  }
  const { register, formState, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(AddUserGroupsSchema),
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
        key='AddUserGroupModal'
        id='add-user-groups-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            <h2>
              <FormattedMessage id='title.addingGroup' defaultMessage='Adding Groups' />
            </h2>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='name'>
                <FormattedMessage id='label.userGroupName' defaultMessage='Group Name' />
              </Label>
              <Input
                id='userGroupName'
                name='userGroupName'
                autoFocus
                invalid={errors.name && true}
                innerRef={register()}
              />
              {errors && errors.name && <FormError>{errors.name.message}</FormError>}
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

export default AddUserGroupModal
