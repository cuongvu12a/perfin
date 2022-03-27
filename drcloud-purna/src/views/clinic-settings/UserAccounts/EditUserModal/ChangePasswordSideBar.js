import { useEffect } from 'react'
import * as yup from 'yup'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, FormGroup, Button, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import InputPasswordToggle from '@core/components/input-password-toggle'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import FormError from '@components/FormError'
import { resetUserPasswordAPI } from '@api/main'
import { KeyBoardEnum, FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Users

const ChangePasswordSidebar = ({ open, employeeId, toggle, handleError403 }) => {
  const ChangePasswordSchema = yup.object().shape({
    newPassword: yup
      .string()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'formError.password')
      .max(128),
    retypeNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'formError.passwordMatch')
  })
  const defaultValues = {
    newPassword: '',
    retypeNewPassword: ''
  }
  const { register, handleSubmit, reset, errors, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [open, reset])

  const onSubmit = async data => {
    try {
      delete data.retypeNewPassword
      console.log('>>>data', data)
      await resetUserPasswordAPI(employeeId, data, xScreenId)
      toggle()
      Toast.showSuccess('toast.success')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
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
              <Label for='newPassword'>
                <FormattedMessage id='label.newPassword' defaultMessage='New Password' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <InputPasswordToggle
                htmlFor='newPassword'
                name='newPassword'
                autoFocus
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

export default ChangePasswordSidebar
