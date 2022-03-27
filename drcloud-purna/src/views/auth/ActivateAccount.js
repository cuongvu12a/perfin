import { useState, useEffect } from 'react'
import * as yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { yupResolver } from '@hookform/resolvers/yup'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Form, FormGroup, Label, Input, Button, CardTitle, CardText, Row, Col, Alert } from 'reactstrap'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'

import useQuery from '@hooks/useQuery'
import { isObjEmpty } from '@utility/utils'
import { loginAC } from '@store/actions/auth'
import { getErrorMessage } from '@api/handleApiError'
import { verifyEmailAPI } from '@api/main'
import AuthLayout from '@layouts/AuthLayout'
import InputPasswordToggle from '@core/components/input-password-toggle'
import FormError from '@components/FormError'

import '@core/scss/base/pages/page-auth.scss'
import bannerImg from '@assets/images/banner/login-v2.svg'

const ActiveAccount = () => {
  const query = useQuery()
  const history = useHistory()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const [verificationKey, setVerificationKey] = useState('')

  const validationSchema = yup.object().shape({
    firstName: yup.string().required().max(128),
    lastName: yup.string().required().max(128),
    password: yup
      .string()
      .required()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'formError.password')
      .max(128),
    retypePassword: yup.string().oneOf([yup.ref('password'), null], 'formError.passwordMatch')
  })
  const defaultValues = {
    firstName: '',
    lastName: '',
    password: '',
    retypePassword: ''
  }
  const { register, handleSubmit, formState, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  useEffect(() => {
    const key = query.get('key')
    if (!key) {
      setErrorMessage('auth.invalidUrl')
    } else {
      setVerificationKey(decodeURI(key))
    }
  }, [])

  const onSubmit = async data => {
    try {
      if (isObjEmpty(errors)) {
        const res = await verifyEmailAPI({
          verificationKey,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password
        })
        dispatch(loginAC(res.data))
        history.push('/')
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout bannerSource={bannerImg}>
      <CardTitle tag='h2' className='font-weight-bold mb-1'>
        <FormattedMessage id='auth.welcome' defaultMessage='Welcome to Dr.Cloud!' />
      </CardTitle>
      <CardText className='mb-2'>
        <FormattedMessage id='auth.finishSettingUp' defaultMessage='Finish setting up your account.' />
      </CardText>
      <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm='6'>
            <FormGroup>
              <Label className='form-label' for='firstName'>
                <div className='d-flex flex-row'>
                  <FormattedMessage id='label.firstName' defaultMessage='First name' />
                  <span className='text-danger'>&nbsp;*</span>
                </div>
              </Label>
              <Input
                autoFocus
                id='firstName'
                name='firstName'
                innerRef={register()}
                invalid={errors.firstName && true}
                autoComplete='off'
              />
              {errors && errors.firstName && <FormError>{errors.firstName.message}</FormError>}
            </FormGroup>
          </Col>
          <Col sm='6'>
            <FormGroup>
              <Label className='form-label' for='lastName'>
                <div className='d-flex flex-row'>
                  <FormattedMessage id='label.lastName' defaultMessage='Last name' />
                  <span className='text-danger'>&nbsp;*</span>
                </div>
              </Label>
              <Input
                id='lastName'
                name='lastName'
                innerRef={register()}
                invalid={errors.lastName && true}
                autoComplete='off'
              />
              {errors && errors.lastName && <FormError>{errors.lastName.message}</FormError>}
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label className='form-label' for='password'>
            <div className='d-flex flex-row'>
              <FormattedMessage id='label.password' defaultMessage='Password' />
              <span className='text-danger'>&nbsp;*</span>
            </div>
          </Label>
          <InputPasswordToggle
            id='password'
            name='password'
            innerRef={register()}
            invalid={errors.password && true}
            className={classnames('input-group-merge', {
              'is-invalid': errors.password
            })}
            autoComplete='new-password'
          />
          {errors && errors.password && <FormError>{errors.password.message}</FormError>}
        </FormGroup>
        <FormGroup>
          <Label for='retypePassword'>
            <div className='d-flex flex-row'>
              <FormattedMessage id='label.retypePassword' defaultMessage='Retype password' />
              <span className='text-danger'>&nbsp;*</span>
            </div>
          </Label>
          <InputPasswordToggle
            id='retypePassword'
            name='retypePassword'
            onPaste={e => {
              e.preventDefault()
            }}
            innerRef={register()}
            invalid={errors.retypePassword && true}
            className={classnames('input-group-merge', {
              'is-invalid': errors.retypePassword
            })}
            autoComplete='new-password'
          />
          {errors && errors.retypePassword && <FormError>{errors.retypePassword.message}</FormError>}
        </FormGroup>
        <Button.Ripple
          type='submit'
          color='primary'
          block
          disabled={!formState.isDirty || !formState.isValid || formState.isSubmitting}
        >
          <FormattedMessage id='button.activateAccount' defaultMessage='Activate account' />
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

export default ActiveAccount
