import { useState, Fragment, useContext } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Form, FormGroup, Label, Input, CustomInput, Button, CardTitle, CardText, Alert } from 'reactstrap'

import AuthLayout from '@layouts/AuthLayout'
import { isObjEmpty } from '@utility/utils'
import { IntlContext } from '@utility/context/Internationalization'
import Toast from '@utility/toast'
import { registerAPI, resendConfirmationAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import PhoneInput from '@components/PhoneInput'
import FormError from '@components/FormError'

import '@core/scss/base/pages/page-auth.scss'
import bannerImg from '@assets/images/banner/login-v2.svg'

const Register = () => {
  const [showComponent, setShowComponent] = useState('register') // 'register' | 'verifyEmail' | 'thanks'
  const [policyCheck, setPolicyCheck] = useState(false)
  const [registerResult, setRegisterResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const intlContext = useContext(IntlContext)

  const validationSchema = yup.object().shape({
    businessName: yup.string().required().min(3).max(256),
    email: yup.string().required().email(),
    phoneNumber: yup.string().required().max(16),
    signUpCode: yup.string().test('signUpCode', 'formError.signUpCode', value => !value || value.length === 8)
  })
  const defaultValues = {
    businessName: '',
    email: '',
    phoneNumber: '',
    signUpCode: ''
  }
  const { register, handleSubmit, control, formState, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  const toggleChecked = () => setPolicyCheck(!policyCheck)

  const onSubmit = async data => {
    try {
      if (isObjEmpty(errors)) {
        setErrorMessage('')
        const result = await registerAPI(data, intlContext.locale)
        setRegisterResult(result.data)
        if (data.signUpCode) {
          setShowComponent('verifyEmail')
        } else {
          setShowComponent('thanks')
        }
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const onResend = async () => {
    try {
      delete registerResult.verifyCodeExpiredUnixTime
      await resendConfirmationAPI({ confirmationId: registerResult.confirmationId }, intlContext.locale)
      Toast.showSuccess('toast.success')
    } catch (error) {
      Toast.showError('toast.error')
    }
  }

  const AgreePolicyLabel = () => {
    return (
      <Fragment>
        <FormattedMessage id='auth.agreeTo.1' defaultMessage='I agree to ' />
        <a href='https://drcloud.vn/legal/privacy-policies' target='blank'>
          <FormattedMessage id='auth.agreeTo.2' defaultMessage='Privacy Policy' />
        </a>
        {' & '}
        <a href='https://drcloud.vn/legal/terms-and-conditions' target='blank'>
          <FormattedMessage id='auth.agreeTo.3' defaultMessage='Terms of Use' />
        </a>
      </Fragment>
    )
  }

  return (
    <Fragment>
      {showComponent === 'register' && (
        <AuthLayout bannerSource={bannerImg}>
          <CardTitle tag='h2' className='font-weight-bold mt-2 mb-1'>
            <FormattedMessage id='title.signUp' defaultMessage='Sign up' />
          </CardTitle>
          <p>
            <FormattedMessage id='auth.haveAccount.1' defaultMessage='Already have an account? ' />
            <Link to='./Login'>
              <FormattedMessage id='auth.haveAccount.2' defaultMessage='Sign in.' />
            </Link>
          </p>
          <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='form-label' for='business-name'>
                <div className='d-flex flex-row'>
                  <FormattedMessage id='label.businessName' defaultMessage='Business name' />
                  <span className='text-danger'>&nbsp;*</span>
                </div>
              </Label>
              <Input
                autoFocus
                type='text'
                id='business-name'
                name='businessName'
                invalid={errors.businessName && true}
                innerRef={register()}
              />
              {errors && errors.businessName && <FormError>{errors.businessName.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label className='form-label' for='register-email'>
                <div className='d-flex flex-row'>
                  <FormattedMessage id='label.email' defaultMessage='Email' />
                  <span className='text-danger'>&nbsp;*</span>
                </div>
              </Label>
              <Input
                type='email'
                id='register-email'
                name='email'
                invalid={errors.email && true}
                innerRef={register()}
              />
              {errors && errors.email && <FormError>{errors.email.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label className='form-label' for='phone-number'>
                <div className='d-flex flex-row'>
                  <FormattedMessage id='label.phoneNumber' defaultMessage='Phone number' />
                  <span className='text-danger'>&nbsp;*</span>
                </div>
              </Label>
              <PhoneInput name='phoneNumber' control={control} invalid={!!errors && !!errors.phoneNumber} />
              {errors && errors.phoneNumber && <FormError>{errors.phoneNumber.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <Label className='form-label' for='signup-code'>
                <FormattedMessage id='label.signUpCode' defaultMessage='Sign up code' />
              </Label>
              <Input
                type='text'
                id='signup-code'
                name='signUpCode'
                innerRef={register()}
                invalid={!!errors && !!errors.signUpCode}
              />
              {errors && errors.signUpCode && <FormError>{errors.signUpCode.message}</FormError>}
            </FormGroup>
            <FormGroup>
              <CustomInput
                type='checkbox'
                name='policyCheck'
                id='policyCheck'
                checked={policyCheck}
                onChange={toggleChecked}
                className='custom-control-Primary'
                label={<AgreePolicyLabel />}
              />
            </FormGroup>
            <Button.Ripple
              type='submit'
              color='primary'
              block
              disabled={!formState.isDirty || !formState.isValid || formState.isSubmitting || !policyCheck}
            >
              <FormattedMessage id='button.createAccount' defaultMessage='Create account' />
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
      )}
      {showComponent === 'verifyEmail' && (
        <AuthLayout bannerSource={bannerImg}>
          <CardTitle tag='h2' className='font-weight-bold mb-1'>
            <FormattedMessage id='auth.verifyYourEmail' defaultMessage='Verify your email' />
          </CardTitle>
          <CardText className='mb-2'>
            <FormattedMessage
              id='auth.verifyEmailMessage'
              defaultMessage='Your account has been made, please verify it by clicking the activation link that has been sent to your email.'
            />
          </CardText>
          <Fragment>
            <FormattedMessage id='auth.resendEmail.1' defaultMessage='Didn’t recieve the email? ' />
            <a className='ml-25' href='#' onClick={onResend}>
              <FormattedMessage id='auth.resendEmail.2' defaultMessage='Resend.' />
            </a>
          </Fragment>
        </AuthLayout>
      )}
      {showComponent === 'thanks' && (
        <AuthLayout bannerSource={bannerImg}>
          <CardTitle tag='h2' className='font-weight-bold mb-1'>
            <FormattedMessage id='auth.thanksForSigningUp' defaultMessage='Thanks for signing up' />
          </CardTitle>
          <CardText className='mb-2'>
            <FormattedMessage
              id='auth.thanksMessage'
              defaultMessage='Our team will contact you to finish setting up your account.'
            />
          </CardText>
        </AuthLayout>
      )}
    </Fragment>
  )
}

export default Register
