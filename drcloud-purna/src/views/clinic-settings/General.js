import { useState, useEffect, useContext } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormattedMessage } from 'react-intl'
import { Card, CardHeader, CardBody, CardTitle, Button, Media, Label, Input, FormGroup, Form } from 'reactstrap'
import { useSelector } from 'react-redux'

import Toast from '@utility/toast'
import { getClinicGeneralSettingsAPI, updateClinicGeneralSettingsAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import FormError from '@components/FormError'

import defaultAvatar from '@assets/images/avatar-blank.png'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import { FrontEndScreenEnum, KeyBoardEnum, PhysicalFileTypeEnum } from '@utility/constants'

import UploadAvatar from '@sections/UploadAvatar'

const xScreenId = FrontEndScreenEnum.GeneralSettings

const General = ({ handleError403 }) => {
  const clinicGeneralSchema = yup.object().shape({
    clinicName: yup.string().min(3).max(256).required().trim(),
    allowBookingInDays: yup.number().integer().min(3).max(30).required()
  })

  const [logo, setLogo] = useState(null)
  const ability = useContext(AbilityContext)
  const isEditable = ability.can('write', 'general')
  const clinicData = useSelector(state => state.auth.clinicData)

  const defaultValues = {
    clinicName: '',
    allowBookingInDays: 3,
    logoFileId: null
  }

  const { register, reset, handleSubmit, errors, formState, control } = useForm({
    mode: 'onChange',
    resolver: yupResolver(clinicGeneralSchema),
    defaultValues
  })

  useEffect(async () => {
    try {
      const result = await getClinicGeneralSettingsAPI(xScreenId)
      setLogo(clinicData?.logo || { fileUrl: defaultAvatar })

      reset({
        ...defaultValues,
        ...{
          clinicName: result.data.clinicName,
          allowBookingInDays: result.data.allowBookingInDays,
          logoFileId: clinicData?.logo?.physicalFileId || null
        }
      })
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [reset])

  const onSubmit = async data => {
    try {
      await updateClinicGeneralSettingsAPI(data, xScreenId)
      reset(data)
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
    <Card>
      <Form>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id='title.generalSettings' defaultMessage='General Settings' />
          </CardTitle>
          <Can I='write' a='general'>
            <Button
              color='primary'
              size='md'
              type='submit'
              onClick={handleSubmit(onSubmit)}
              disabled={!formState.isDirty || !formState.isValid || formState.isSubmitting || !isEditable}
            >
              <FormattedMessage id='button.save' />
            </Button>
          </Can>
        </CardHeader>
        <CardBody>
          <Controller
            name='logoFileId'
            control={control}
            render={({ onChange }) => (
              <UploadAvatar physicalFileType={PhysicalFileTypeEnum.Avatar} image={logo?.fileUrl} setFileId={onChange} />
            )}
          />

          <FormGroup className='mt-2'>
            <Label for='name'>
              <FormattedMessage id='label.clinicName' defaultMessage='Clinic Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='clinicName'
              name='clinicName'
              autoFocus
              innerRef={register()}
              invalid={!!errors.clinicName}
              disabled={!isEditable}
            />
            {errors && errors.clinicName && <FormError>{errors.clinicName.message}</FormError>}
          </FormGroup>
          <FormGroup>
            <Label>
              <FormattedMessage id='label.allowBookingInDays' defaultMessage='Allow booking in days' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              type='number'
              step='1'
              className='w-25'
              id='allowBookingInDays'
              name='allowBookingInDays'
              innerRef={register({ valueAsNumber: true })}
              invalid={!!errors.allowBookingInDays}
              disabled={!isEditable}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                }
              }}
            />
            {errors && errors.allowBookingInDays && <FormError>{errors.allowBookingInDays.message}</FormError>}
          </FormGroup>
        </CardBody>
      </Form>
    </Card>
  )
}

export default withAuthorization(General, 'general', false)
