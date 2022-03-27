import { useState, Fragment, useEffect, useContext } from 'react'
import { ChevronLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import { CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { isObjEmpty } from '@utility/utils'
import { FormattedMessage, IntlContext } from 'react-intl'

import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import { forgotPasswordAPI, resendConfirmationAPI } from '@api/main'
import FormError from '@components/FormError'
import AuthLayout from '@layouts/AuthLayout'

import '@core/scss/base/pages/page-auth.scss'
import bannerImg from '@assets/images/banner/forgot-password-v2.svg'

const ForgotPassword = () => {
  const [confirmationId, setConfirmationId] = useState(null)
  const [disable, setDisable] = useState(true)
  const [count, setCount] = useState(120)
  const intlContext = useContext(IntlContext)

  const validationSchema = yup.object().shape({
    userName: yup.string().required().email()
  })

  const { register, handleSubmit, formState, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = async data => {
    try {
      if (isObjEmpty(errors)) {
        const res = await forgotPasswordAPI(data, intlContext.locale)
        setConfirmationId(res.data.confirmationId)
      }
      Toast.showSuccess('toast.success')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  const onResend = async () => {
    try {
      await resendConfirmationAPI({ confirmationId })
      setCount(120)
      setDisable(true)
      Toast.showSuccess('toast.success')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (confirmationId) {
      const timer = count > 0 && setInterval(() => setCount(count => count - 1), 1000)
      if (count === 0) {
        setDisable(false)
      }
      return () => clearInterval(timer)
    }
  })

  return (
    <AuthLayout bannerSource={bannerImg}>
      {!confirmationId ? (
        <>
          <CardTitle tag='h2' className='font-weight-bold mb-1'>
            <FormattedMessage id='auth.forgotPassword' defaultMessage='Forgot Password? 🔒' />
          </CardTitle>
          <CardText className='mb-2'>
            <FormattedMessage
              id='auth.forgotPasswordMessage'
              defaultMessage='Enter your email and we will send you instructions to reset your password.'
            />
          </CardText>
          <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='form-label' for='login-email'>
                <FormattedMessage id='label.email' defaultMessage='Email' />
              </Label>
              <Input
                type='email'
                id='login-email'
                name='userName'
                invalid={errors.email && true}
                innerRef={register()}
                autoFocus
              />
              {errors && errors.email && <FormError>{errors.email.message}</FormError>}
            </FormGroup>
            <Button.Ripple
              color='primary'
              type='submit'
              color='primary'
              block
              disabled={!formState.isValid || formState.isSubmitting}
            >
              <FormattedMessage id='button.sendResetLink' defaultMessage='Send Reset Link' />
            </Button.Ripple>
          </Form>
          <p className='text-center mt-2'>
            <Link to='/login'>
              <ChevronLeft className='mr-25' size={14} />
              <span className='align-middle'>
                <FormattedMessage id='auth.backToLogin' defaultMessage='Back to login' />
              </span>
            </Link>
          </p>
        </>
      ) : (
        <>
          <CardTitle tag='h2' className='font-weight-bold mb-1'>
            <FormattedMessage id='auth.passwordResetEmailSent' defaultMessage='Password Reset Email Sent' />
          </CardTitle>
          <CardText className='mb-2'>
            <FormattedMessage
              id='auth.forgotPasswordFollowInstructionsMessage'
              defaultMessage='Follow the instructions in the email to reset your password.'
            />
          </CardText>

          <Button.Ripple
            className='d-flex justify-content-center'
            color='primary'
            block
            disabled={disable}
            onClick={onResend}
          >
            <FormattedMessage id='button.resendResetEmail' defaultMessage='Resend Reset Email' />
            {disable && <div className='ml-50'>({count}s)</div>}
          </Button.Ripple>
        </>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
