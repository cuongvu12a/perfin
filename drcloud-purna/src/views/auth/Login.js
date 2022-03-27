import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useHistory } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button, CardTitle, Alert } from 'reactstrap'

import { loginAC } from '@store/actions/auth'
import { isObjEmpty } from '@utility/utils'
import { loginAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import AuthLayout from '@layouts/AuthLayout'
import InputPasswordToggle from '@core/components/input-password-toggle'

import '@core/scss/base/pages/page-auth.scss'
import bannerImg from '@assets/images/banner/login-v2.svg'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = yup.object().shape({
    userName: yup.string().required().email(),
    password: yup.string().required()
  })
  const defaultValues = {
    userName: '',
    password: ''
  }
  const { register, handleSubmit, formState, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  const onSubmit = async data => {
    try {
      if (isObjEmpty(errors)) {
        setErrorMessage('')
        const result = await loginAPI(data)
        dispatch(loginAC(result.data))
        history.push('/')
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout bannerSource={bannerImg}>
      <CardTitle tag='h2' className='font-weight-bold mt-2 mb-1'>
        <FormattedMessage id='title.signIn' defaultMessage='Sign in' />
      </CardTitle>
      <p>
        <FormattedMessage id='auth.noAccount.1' defaultMessage="Don't have an account? " />
        <Link to='/register'>
          <FormattedMessage id='auth.noAccount.2' defaultMessage='Sign up.' />
        </Link>
      </p>
      <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label className='form-label' for='userName'>
            <FormattedMessage id='label.email' defaultMessage='Email' />
          </Label>
          <Input
            autoFocus
            type='email'
            id='userName'
            name='userName'
            innerRef={register()}
            placeholder='name@example.com'
            autoComplete='username'
          />
        </FormGroup>
        <FormGroup>
          <div className='d-flex justify-content-between'>
            <Label className='form-label' for='password'>
              <FormattedMessage id='label.password' defaultMessage='Password' />
            </Label>
            <Link to='/forgot-password' tabIndex='-1'>
              <FormattedMessage id='auth.forgotPassword' defaultMessage='Forgot password?' />
            </Link>
          </div>
          <InputPasswordToggle
            id='password'
            name='password'
            className='input-group-merge'
            innerRef={register()}
            placeholder='············'
            autoComplete='current-password'
          />
        </FormGroup>
        <Button.Ripple
          type='submit'
          color='primary'
          block
          disabled={!formState.isDirty || !formState.isValid || formState.isSubmitting}
        >
          <FormattedMessage id='button.signIn' defaultMessage='Sign in' />
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

export default Login
