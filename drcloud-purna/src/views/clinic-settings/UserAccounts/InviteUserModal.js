import { Fragment, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Button, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap'
import * as yup from 'yup'
import { getErrorMessage } from '@api/handleApiError'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import Toast from '@utility/toast'
import { getRolesAPI, inviteUserAPI } from '@api/main'
import { arrayToSelectOptions } from '@utility/utils'
import FormError from '@components/FormError'
import Select from '@components/Select'
import { RoleTypeEnum, FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Users

const InviteUserModal = ({ open, close }) => {
  const InviteUserSchema = yup.object().shape({
    emails: yup
      .array()
      .transform((value, originalValue) => {
        if (yup.mixed().isType(value) && value !== null) {
          return value
        }
        return originalValue ? originalValue.replace(' ', '').split(',') : []
      })
      .of(yup.string().email())
      .max(20)
      .min(1),
    roleId: yup.string().required()
  })
  const defaultValues = {
    emails: '',
    roleId: ''
  }
  const { register, formState, handleSubmit, errors, control, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(InviteUserSchema),
    defaultValues
  })

  const [roles, setRoles] = useState([])

  useEffect(async () => {
    const res = await getRolesAPI(50, 1, '', xScreenId)
    const filterRoles = res.data.pageData.filter(role => role.roleTypeId !== RoleTypeEnum.Owner)
    setRoles(filterRoles)
    const defaultRoleId = res.data.pageData.find(role => role.roleTypeId === RoleTypeEnum.Admin).roleId
    reset({
      ...defaultValues,
      ...{ roleId: defaultRoleId }
    })
  }, [])

  const onSubmit = async data => {
    try {
      await inviteUserAPI(data, xScreenId)
      Toast.showSuccess('toast.success')
      close('SAVED')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
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
            <h2>
              <FormattedMessage id='title.inviteUser' defaultMessage='Invite User' />
            </h2>
          </ModalHeader>
          <ModalBody className='clinic-settings'>
            <FormGroup>
              <Label for='email'>
                <FormattedMessage id='label.email' defaultMessage='Email' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input id='emails' name='emails' autoFocus invalid={errors.emails && true} innerRef={register()} />
              {errors && errors.emails && (
                <FormError>
                  {Array.isArray(errors.emails)
                    ? errors.emails[errors.emails.length - 1].message
                    : errors.emails.message}
                </FormError>
              )}
              <div className='description-text'>
                <FormattedMessage
                  id='userAccounts.descriptionForEmails'
                  defaultMessage='Separate emails with commas to add multiple users at once (at most 20 emails)'
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label for='roleId'>
                <FormattedMessage id='label.role' defaultMessage='Role' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Select
                id='roleId'
                name='roleId'
                control={control}
                menuPlacement='top'
                options={arrayToSelectOptions(roles, 'roleName', 'roleId')}
                maxMenuHeight={150}
                isClearable={false}
              />
              <div className='description-text'>
                <FormattedMessage
                  id='userAccounts.descriptionForRole.1'
                  defaultMessage='* An email containing the activation link will be sent to the users email'
                />
              </div>
              <div className='description-text mt-0'>
                <FormattedMessage
                  id='userAccounts.descriptionForRole.2'
                  defaultMessage='* New users will not belong to any groups'
                />
              </div>
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
                  <FormattedMessage id='button.invite' defaultMessage='Invite' />
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default InviteUserModal
