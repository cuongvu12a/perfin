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
import classnames from 'classnames'

import Toast from '@utility/toast'
import { getUserAccountByIdAPI, updateUserAccountAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import Switch from '@components/Switch'
import Tabs from './Tabs'
import GeneralTabContent from './GeneralTabContent'
import InfoTabContent from './InfoTabContent'
import UserGroupsTabContent from './UserGroupsTabContent'
import SkillsTabContent from './SkillsTabContent'
import ChangePasswordSidebar from './ChangePasswordSideBar'
import { RoleTypeEnum, FrontEndScreenEnum, CountryEnum, CityEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Users

const EditUserModal = ({ open, isOwner, hasRoleWrite, employee, close, handleError403 }) => {
  const EditUserSchema = yup.object().shape({
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
    skillIds: [],
    isEnabled: true,
    userGroupIds: []
  }

  const { register, handleSubmit, formState, errors, control, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditUserSchema),
    defaultValues
  })

  const [activeTab, setActiveTab] = useState('general')
  const [openSidebar, setOpenSidebar] = useState(false)
  const isEditable = employee.roleTypeId === RoleTypeEnum.Owner ? isOwner : hasRoleWrite

  useEffect(async () => {
    try {
      if (employee) {
        const result = await getUserAccountByIdAPI(employee.employeeId, xScreenId)
        const activeIds = result.data.userGroupIds.sort()
        reset({
          ...defaultValues,
          ...{
            firstName: result.data.firstName || '',
            lastName: result.data.lastName || '',
            email: result.data.email || '',
            roleId: result.data.roleId || null,
            phoneNumber: result.data.phoneNumber || '',
            address: result.data.address || '',
            cityId: result.data.cityId || CityEnum.HaNoi,
            countryId: result.data.countryId || CountryEnum.Vietnam,
            skillIds: result.data.skillIds || [],
            isEnabled: result.data.isEnabled || true,
            userGroupIds: activeIds || []
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
  }, [employee, reset])

  const toggleTab = tab => {
    if (tab === 'changePassword') {
      setOpenSidebar(true)
    } else {
      setActiveTab(tab)
    }
  }

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const onSubmit = async data => {
    try {
      delete data.email
      await updateUserAccountAPI(employee.employeeId, data, xScreenId)
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
            <h2>{employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.userName}</h2>
            <Switch
              activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
              deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
              name='isEnabled'
              control={control}
              disabled={!isEditable || employee.roleTypeId === RoleTypeEnum.Owner}
            />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-2 mb-md-0' md='3'>
                <Tabs activeTab={activeTab} isEditable={isEditable} toggleTab={toggleTab} />
              </Col>
              <Col md='9'>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='general'>
                        <GeneralTabContent
                          register={register}
                          errors={errors}
                          isEditable={isEditable}
                          isOwner={employee.roleTypeId === RoleTypeEnum.Owner}
                          toggleTab={toggleTab}
                          control={control}
                        />
                      </TabPane>
                      <TabPane tabId='information'>
                        <InfoTabContent
                          register={register}
                          errors={errors}
                          control={control}
                          isEditable={isEditable}
                          toggleTab={toggleTab}
                        />
                      </TabPane>
                      <TabPane tabId='skills'>
                        <SkillsTabContent isEditable={isEditable} control={control} />
                      </TabPane>
                      <TabPane tabId='userGroups'>
                        <UserGroupsTabContent control={control} isEditable={isEditable} />
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
        <div
          className={classnames('body-content-overlay', {
            show: openSidebar
          })}
          onClick={toggleSidebar}
        ></div>
        {openSidebar && isEditable && (
          <ChangePasswordSidebar
            open={openSidebar}
            employeeId={employee.employeeId}
            toggle={toggleSidebar}
            handleError403={handleError403}
          />
        )}
      </Modal>
    </Fragment>
  )
}
export default EditUserModal
