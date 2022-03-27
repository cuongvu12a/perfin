import { useState, useEffect, Fragment } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Form
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import SettingsLocationTab from './SettingsLocationTab'
import GeneralLocationTab from './GeneralLocationTab'
import Tabs from './Tabs'
import Toast from '@utility/toast'
import { createLocationsAPI, getLocationsIdAPI, updateLocationsAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import Switch from '@components/Switch'
import { CityEnum, CountryEnum, FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Locations

const EditLocationModal = ({ open, isEditable, location, close, handleError403 }) => {
  const [activeTab, setActiveTab] = useState('general')

  const EditLocationSchema = yup.object().shape({
    locationName: yup.string().required().max(128).trim(),
    phoneNumber: yup.string().required().max(16),
    minPriceInVnd: yup.number().min(0).max(yup.ref('maxPriceInVnd'), 'formError.minPrice'),
    maxPriceInVnd: yup
      .number()
      .min(0)
      .when('minPriceInVnd', {
        is: value => {
          return value !== 0
        },
        then: yup.number().min(0).moreThan(yup.ref('minPriceInVnd'), 'formError.maxPrice')
      }),
    longitude: yup.number().required().min(101.681565).max(109.4541223),
    latitude: yup.number().required().min(8.566806).max(23.3926185),
    cityId: yup.number(),
    countryId: yup.number(),
    healthDeclarationUrl: yup.string().max(1024).trim(),
    address: yup.string().required().max(256).trim()
  })

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const defaultValues = {
    locationName: '',
    phoneNumber: '',
    maxPriceInVnd: 0,
    minPriceInVnd: 0,
    healthDeclarationUrl: '',
    address: '',
    longitude: 105.0922029,
    latitude: 20.9727589,
    cityId: CityEnum.HaNoi,
    countryId: CountryEnum.Vietnam,
    isVisibleForBooking: true
  }

  const { register, handleSubmit, formState, errors, control, reset } = useForm({
    mode: 'all',
    resolver: yupResolver(EditLocationSchema),
    defaultValues
  })

  useEffect(async () => {
    try {
      if (location) {
        const result = await getLocationsIdAPI(location.locationId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            locationName: result.data.locationName,
            phoneNumber: result.data.phoneNumber,
            maxPriceInVnd: result.data.maxPriceInVnd,
            minPriceInVnd: result.data.minPriceInVnd,
            healthDeclarationUrl: result.data.healthDeclarationUrl,
            address: result.data.address,
            longitude: result.data.longitude,
            latitude: result.data.latitude,
            cityId: result.data.cityId,
            countryId: result.data.countryId,
            isEnabled: result.data.isEnabled,
            isVisibleForBooking: result.data.isVisibleForBooking
          }
        })
      }
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [location, reset])

  const onSubmit = async data => {
    try {
      if (location) {
        await updateLocationsAPI(location.locationId, data, xScreenId)
      } else {
        await createLocationsAPI(data, xScreenId)
      }
      Toast.showSuccess('toast.success')
      close('SAVED')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={open}
        toggle={close}
        autoFocus={false}
        backdrop='static'
        className='modal-dialog-centered modal-md'
        key='EditLocationsModal'
        id='edit-locations-modal'
      >
        <Form>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {location ? (
              <>
                <h2>{location.locationName}</h2>
                <Switch
                  activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                  deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                  name='isEnabled'
                  control={control}
                  disabled={!isEditable}
                />
              </>
            ) : (
              <h2>
                <FormattedMessage id='title.addLocation' defaultMessage='Adding Location' />
              </h2>
            )}
          </ModalHeader>

          <ModalBody>
            <Row>
              <Col className='mb-2 mb-md-0' md='3'>
                <Tabs activeTab={activeTab} toggleTab={toggleTab} />
              </Col>
              <Col md='9'>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='general'>
                        <GeneralLocationTab
                          register={register}
                          toggleTab={toggleTab}
                          errors={errors}
                          control={control}
                          isEditable={isEditable}
                        />
                      </TabPane>
                      <TabPane tabId='settings'>
                        <SettingsLocationTab
                          register={register}
                          toggleTab={toggleTab}
                          errors={errors}
                          isValid={formState.isValid}
                          control={control}
                          isEditable={isEditable}
                        />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {(!formState.isDirty || !isEditable) && (
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}
            {formState.isDirty && isEditable && (
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
                  <FormattedMessage id='button.save' defaultMessage='Save' />
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}
export default EditLocationModal
