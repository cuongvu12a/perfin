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
  Form,
  Input
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import { Edit3 } from 'react-feather'

import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import Switch from '@components/Switch'
import Dialog from '@utility/dialog'

import { getUserGroupDetailAPI, createUserGroupAPI, updateUserGroupAPI } from '@api/main'
import LocationPermissionTab from './LocationPermissionTab'
import DoctorPermissionTab from './DoctorPermissionTab'
import UserTab from './UserTab'
import Tabs from './Tabs'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.UserGroups

const EditUserGroupModal = ({ open, isEditable, close, userGroups, handleError403 }) => {
  const [activeTab, setActiveTab] = useState('locationPermissions')
  const [isEditingName, setIsEditingName] = useState(false)

  const intl = useIntl()

  const defaultValues = {
    userGroupName: userGroups?.userGroupName,
    users: [],
    locationIds: [],
    doctorIds: [],
    isAllLocations: false,
    isAllDoctors: false
  }

  const { handleSubmit, formState, control, errors, reset, watch, register } = useForm({
    mode: 'onChange',
    defaultValues
  })

  const isAllLocations = watch('isAllLocations')
  const isAllDoctors = watch('isAllDoctors')

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  useEffect(async () => {
    try {
      if (userGroups.userGroupId) {
        const res = await getUserGroupDetailAPI(userGroups.userGroupId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            isEnabled: res.data.isEnabled,
            isAllDoctors: res.data.isAllDoctors,
            isAllLocations: res.data.isAllLocations,
            locationIds: res.data.locationIds.sort((a, b) => (a > b && 1) || -1),
            doctorIds: res.data.doctorIds.sort((a, b) => (a > b && 1) || -1),
            users: res.data.users.sort((a, b) => (a.userId > b.userId && 1) || -1)
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
  }, [])

  const onSubmit = async data => {
    const newData = {
      ...data,
      name: data.userGroupName || userGroups?.userGroupName,
      userIds: data.users.map(user => user.userId)
    }

    delete newData.users

    try {
      if (userGroups.userGroupId) {
        if (
          data.locationIds.length === 0 &&
          data.doctorIds.length === 0 &&
          data.isAllDoctors === false &&
          data.isAllLocations === false
        ) {
          await Dialog.showInfo({
            title: intl.formatMessage({ id: 'dialog.createGroupWithNoPermission' }),
            text: intl.formatMessage({ id: 'dialog.createGroupWithNoPermissionMessage' })
          })
          return
        }
        await updateUserGroupAPI(userGroups.userGroupId, newData, xScreenId)
      } else {
        await createUserGroupAPI(newData, xScreenId)
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
        key='EditUserGroupsModal'
        id='edit-user-groups-modal'
      >
        <Form className='clinic-settings'>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            <div className='d-flex flex-row justify-content-between'>
              {isEditingName ? (
                <Input name='userGroupName' autoFocus invalid={errors.userGroupName && true} innerRef={register()} />
              ) : (
                <h2 className='mb-0'>{userGroups?.userGroupName}</h2>
              )}
              {!isEditingName && isEditable && (
                <div className='ml-2'>
                  <Edit3 size={20} onClick={() => setIsEditingName(true)} />
                </div>
              )}
            </div>
            {userGroups?.userGroupId && (
              <Switch
                activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                name='isEnabled'
                control={control}
                disabled={!isEditable}
              />
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
                      <TabPane tabId='locationPermissions'>
                        <LocationPermissionTab
                          toggleTab={toggleTab}
                          control={control}
                          isAllLocations={isAllLocations}
                          isEditable={isEditable}
                        />
                      </TabPane>
                      <TabPane tabId='doctorPermissions'>
                        <DoctorPermissionTab
                          toggleTab={toggleTab}
                          control={control}
                          isAllDoctors={isAllDoctors}
                          isEditable={isEditable}
                        />
                      </TabPane>
                      <TabPane tabId='users'>
                        <UserTab control={control} isEditable={isEditable} />
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
                <Button color='primary' type='submit' onClick={handleSubmit(onSubmit)}>
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

export default EditUserGroupModal
