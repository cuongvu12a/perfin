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
import { FormattedMessage } from 'react-intl'
import { useForm } from 'react-hook-form'
import { Edit3 } from 'react-feather'
import { flatMap } from 'lodash'
import Toast from '@utility/toast'
import { RoleTypeEnum, FrontEndScreenEnum, PermissionScreens, TabEnum, TitleTabEnum } from '@utility/constants'
import { getErrorMessage } from '@api/handleApiError'
import { createRolesAPI, updateRolesAPI, getRolesDetailAPI } from '@api/main'
import Switch from '@components/Switch'
import RoleTab from '@sections/RoleTab'

import Tabs from './Tabs'

const xScreenId = FrontEndScreenEnum.UserRoles

const getDefaultValues = role => {
  const results = { roleName: role?.roleName }
  Object.keys(TabEnum).forEach(key => {
    results[TabEnum[key]] = PermissionScreens.filter(s => s.tab === TabEnum[key]).map(s => ({
      frontendScreenId: s.frontendScreenId,
      permissionTypeId: 0,
      isEditable: true
    }))
  })
  return results
}

const EditRoleModal = ({ open, isEditable, close, role, handleError403 }) => {
  const defaultValues = getDefaultValues(role)

  const { register, handleSubmit, errors, formState, control, reset } = useForm({
    mode: 'onChange',
    defaultValues
  })

  const [activeTab, setActiveTab] = useState(TabEnum.Settings)
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(async () => {
    try {
      if (role?.roleId) {
        const res = await getRolesDetailAPI(role.roleId, xScreenId)
        const currentPermissionsToTabs = () => {
          const results = {}
          Object.keys(TabEnum).forEach(key => {
            results[TabEnum[key]] = PermissionScreens.filter(s => s.tab === TabEnum[key]).map(
              s =>
                res.data.screenPermissions.find(p => s.frontendScreenId === p.frontendScreenId) || {
                  frontendScreenId: s.frontendScreenId,
                  isEditable: true,
                  permissionTypeId: 0
                }
            )
          })
          return results
        }

        reset({
          ...defaultValues,
          ...{
            ...(!(role.roleTypeId === RoleTypeEnum.Owner || role.roleTypeId === RoleTypeEnum.Admin) && {
              isEnabled: res.data.isEnabled
            }),
            ...currentPermissionsToTabs()
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
  }, [role, reset])

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const onSubmit = async data => {
    const listPermission = Object.keys(TabEnum).map(key => data[TabEnum[key]])
    const screenPermissions = flatMap(listPermission)
    const newData = {
      roleName: data.roleName || role?.roleName,
      screenPermissions,
      ...(role.roleId && { isEnabled: data.isEnabled })
    }
    try {
      if (role.roleId) {
        await updateRolesAPI(role.roleId, newData, xScreenId)
      } else {
        await createRolesAPI(newData, xScreenId)
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
        key='EditRolesModal'
        id='edit-roles-modal'
      >
        <Form className='clinic-settings'>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            <div className='d-flex flex-row justify-content-between'>
              {isEditingName ? (
                <Input name='roleName' autoFocus invalid={errors.roleName && true} innerRef={register()} />
              ) : (
                <h2 className='mb-0'>{role?.roleName}</h2>
              )}
              {!isEditingName && isEditable && role?.roleTypeId !== RoleTypeEnum.Owner && (
                <div className='ml-2'>
                  <Edit3 size={20} onClick={() => setIsEditingName(true)} />
                </div>
              )}
            </div>
            {role?.roleId && !(role.roleTypeId === RoleTypeEnum.Owner || role.roleTypeId === RoleTypeEnum.Admin) ? (
              <Switch
                activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                name='isEnabled'
                control={control}
                disabled={!isEditable}
              />
            ) : null}
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
                      {Object.keys(TabEnum).map(key => {
                        const currentTab = TabEnum[key]
                        return (
                          <TabPane tabId={currentTab} key={currentTab}>
                            <RoleTab
                              toggleTab={toggleTab}
                              control={control}
                              roleTypeId={role?.roleTypeId}
                              isEditable={isEditable && role?.roleTypeId !== RoleTypeEnum.Owner}
                              title={
                                <FormattedMessage
                                  id={TitleTabEnum[key].id}
                                  defaultMessage={TitleTabEnum[key].default}
                                />
                              }
                              listPermission={PermissionScreens.filter(id => id.tab === currentTab)}
                              name={currentTab}
                            />
                          </TabPane>
                        )
                      })}
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

export default EditRoleModal
