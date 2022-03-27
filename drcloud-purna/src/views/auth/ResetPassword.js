import InputPasswordToggle from '@core/components/input-password-toggle'
import classnames from 'classnames'
import { CardTitle, CardText, Form, FormGroup, Label, Button, Alert } from 'reactstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { isObjEmpty } from '@utility/utils'
import { FormattedMessage, IntlContext } from 'react-intl'
import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'

import useQuery from '@hooks/useQuery'
import { resetPasswordAPI } from '@api/main'
import FormError from '@components/FormError'
import AuthLayout from '@layouts/AuthLayout'

import '@core/scss/base/pages/page-auth.scss'
import bannerImg from '@assets/images/banner/forgot-password-v2.svg'
import { getErrorMessage } from '@api/handleApiError'
import Toast from '@utility/toast'

const ResetPassword = () => {
  const query = useQuery()
  const history = useHistory()
  const [confirmationKey, setConfirmationKey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const intlContext = useContext(IntlContext)

  const validationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'formError.password')
      .max(128),
    retypeNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'formError.passwordMatch')
  })

  const { register, handleSubmit, formState, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  })
  useEffect(() => {
    const key = query.get('key')
    if (!key) {
      setErrorMessage('auth.invalidUrl')
    } else {
      setConfirmationKey(decodeURI(key))
    }
  }, [])

  const onSubmit = async data => {
    delete data.retypeNewPassword
    try {
      if (isObjEmpty(errors)) {
        setErrorMessage('')
        await resetPasswordAPI({ confirmationKey, newPassword: data.newPassword }, intlContext.locale)
      }
      Toast.showSuccess('toast.success')
      history.push('/login')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout bannerSource={bannerImg}>
      <CardTitle tag='h2' className='font-weight-bold mb-1'>
        <FormattedMessage id='title.resetPassword' defaultMessage='Reset Password' />
      </CardTitle>
      <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label className='form-label' for='newPassword'>
            <FormattedMessage id='label.newPassword' defaultMessage='New Password' />
            <span className='text-danger'>&nbsp;*</span>
          </Label>
          <InputPasswordToggle
            id='newPassword'
            name='newPassword'
            innerRef={register()}
            className={classnames('input-group-merge', {
              'is-invalid': errors.newPassword && true
            })}
            autoFocus
            autoComplete='new-password'
          />
          {errors && errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}
        </FormGroup>
        <FormGroup>
          <Label className='form-label' for='retypeNewPassword'>
            <FormattedMessage id='label.retypeNewPassword' defaultMessage='Retype New Password' />
            <span className='text-danger'>&nbsp;*</span>
          </Label>
          <InputPasswordToggle
            id='retypeNewPassword'
            name='retypeNewPassword'
            innerRef={register()}
            className={classnames('input-group-merge', {
              'is-invalid': errors.confirmPassword && true
            })}
            autoComplete='new-password'
          />
          {errors && errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}
        </FormGroup>
        <Button.Ripple
          color='primary'
          type='submit'
          color='primary'
          block
          disabled={!formState.isValid || formState.isSubmitting}
        >
          <FormattedMessage id='button.setNewPassword' defaultMessage='Set New Password' />
        </Button.Ripple>
      </Form>
      {errorMessage && (
        <Alert color='danger'>
          <div className='alert-body'>
            <span>
              <FormattedMessage
                id={errorMessage}
                defaultMessage={`Unknown error, please contact technical supporter (${errorMessage})`}
              />
            </span>
          </div>
        </Alert>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
