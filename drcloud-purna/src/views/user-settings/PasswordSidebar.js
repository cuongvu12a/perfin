import { useEffect } from 'react'
import * as yup from 'yup'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, FormGroup, Button, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import InputPasswordToggle from '@core/components/input-password-toggle'
import { updatePasswordAPI } from '@api/main'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import FormError from '@components/FormError'
import { KeyBoardEnum } from '@utility/constants'

const PasswordSidebar = ({ open, toggle }) => {
  const SignupSchema = yup.object().shape({
    oldPassword: yup.string().required(),
    newPassword: yup
      .string()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'formError.password')
      .max(128),
    retypeNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'formError.passwordMatch')
  })
  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    retypeNewPassword: ''
  }
  const { register, handleSubmit, reset, errors, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [open, reset])

  const onSubmit = async data => {
    try {
      delete data.retypeNewPassword
      await updatePasswordAPI(data)
      toggle()
      Toast.showSuccess('toast.success')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  return (
    <div
      className={classnames('sidebar-right', {
        show: open
      })}
      onKeyDown={e => {
        if (e.key === KeyBoardEnum.Escape) {
          toggle()
        }
      }}
    >
      <Form className='password-sidebar-form'>
        <div className='sidebar-content modal-sidebar'>
          <ModalHeader tag='h2' toggle={toggle}>
            <FormattedMessage id='title.changePassword' />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='oldPassword'>
                <FormattedMessage id='label.oldPassword' defaultMessage='Old Password' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <InputPasswordToggle
                htmlFor='oldPassword'
                name='oldPassword'
                autoFocus
                innerRef={register()}
                className={classnames('input-group-merge', {
                  'is-invalid': errors.oldPassword,
                  focus: open
                })}
                autoComplete='current-password'
              />
              {errors && errors.oldPassword && <FormError>{errors.oldPassword.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label for='newPassword'>
                <FormattedMessage id='label.newPassword' defaultMessage='New Password' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <InputPasswordToggle
                htmlFor='newPassword'
                name='newPassword'
                innerRef={register()}
                className={classnames('input-group-merge', {
                  'is-invalid': errors.newPassword
                })}
                autoComplete='new-password'
              />
              {errors && errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label for='retypeNewPassword'>
                <FormattedMessage id='label.retypeNewPassword' defaultMessage='Retype New Password' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <InputPasswordToggle
                htmlFor='retypeNewPassword'
                name='retypeNewPassword'
                innerRef={register()}
                className={classnames('input-group-merge', {
                  'is-invalid': errors.retypeNewPassword
                })}
                autoComplete='new-password'
                onKeyDown={e => {
                  if (e.key === KeyBoardEnum.Tab) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
              />
              {errors && errors.retypeNewPassword && <FormError>{errors.retypeNewPassword.message}</FormError>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              type='submit'
              onClick={handleSubmit(onSubmit)}
              disabled={!(formState.isDirty && formState.isValid) || formState.isSubmitting}
            >
              <FormattedMessage id='button.accept' defaultMessage='Accept' />
            </Button>
          </ModalFooter>
        </div>
      </Form>
    </div>
  )
}

export default PasswordSidebar
