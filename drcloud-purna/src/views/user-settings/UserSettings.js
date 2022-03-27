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
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'

import Tabs from './Tabs'
import InfoTabContent from './InfoTabContent'
import GeneralTabContent from './GeneralTabContent'
import PasswordSidebar from './PasswordSidebar'
import Toast from '@utility/toast'
import { getUserInfoAPI, updateUserAPI } from '@api/main'
import { CityEnum, CountryEnum } from '@utility/constants'
import { getErrorMessage } from '@api/handleApiError'
import defaultAvatar from '@assets/images/avatar-blank.png'

const UserSettingsModal = ({ open, toggle }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [openSidebar, setOpenSidebar] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const userData = useSelector(state => state.auth.userData)

  const validationSchema = yup.object().shape({
    firstName: yup.string().required().max(128).trim(),
    lastName: yup.string().required().max(128).trim(),
    phoneNumber: yup.string().max(16),
    address: yup.string().max(256).trim()
  })

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    cityId: CityEnum.HaNoi,
    countryId: CountryEnum.Vietnam,
    avatarFileId: null
  }

  const { register, formState, handleSubmit, control, errors, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  useEffect(async () => {
    if (open) {
      const result = await getUserInfoAPI()
      setAvatar(userData?.avatar || { fileUrl: defaultAvatar })
      reset({
        ...defaultValues,
        ...{
          firstName: result.data.firstName || '',
          lastName: result.data.lastName || '',
          email: result.data.email || '',
          phoneNumber: result.data.phoneNumber || '',
          address: result.data.address || '',
          cityId: result.data.cityId || CityEnum.HaNoi,
          countryId: result.data.countryId || CountryEnum.Vietnam,
          avatarFileId: userData?.avatar?.physicalFileId || null
        }
      })
    }
  }, [open, reset])

  const toggleTab = tab => {
    if (tab === 'changePassword') {
      setOpenSidebar(true)
    } else {
      setActiveTab(tab)
    }
  }

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
    setTimeout(() => {
      if (activeTab === 'general') {
        document.getElementById('firstName').focus()
      } else {
        document.getElementById('phoneNumber').focus()
      }
    }, 150)
  }

  const onSubmit = async data => {
    try {
      await updateUserAPI(data)
      Toast.showSuccess('toast.success')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={open}
        autoFocus={false}
        backdrop='static'
        toggle={toggle}
        className='modal-dialog-centered modal-lg modal-user-settings'
        key='UserSettingsModal'
        id='user-settings-modal'
      >
        <Form>
          <ModalHeader tag='h2' toggle={toggle}>
            <FormattedMessage id='title.mySettings' defaultMessage='My Settings' />
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
                        <GeneralTabContent
                          register={register}
                          toggleTab={toggleTab}
                          errors={errors}
                          avatar={avatar}
                          control={control}
                        />
                      </TabPane>
                      <TabPane tabId='information'>
                        <InfoTabContent register={register} toggleTab={toggleTab} errors={errors} control={control} />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              type='submit'
              onClick={handleSubmit(onSubmit)}
              disabled={!formState.isDirty || formState.isSubmitting || !formState.isValid}
            >
              <FormattedMessage id='button.save' defaultMessage='Save' />
            </Button>
          </ModalFooter>
        </Form>
        <div
          className={classnames('body-content-overlay', {
            show: openSidebar
          })}
          onClick={toggleSidebar}
        ></div>
        {openSidebar && <PasswordSidebar open={openSidebar} toggle={toggleSidebar} />}
      </Modal>
    </Fragment>
  )
}
export default UserSettingsModal
