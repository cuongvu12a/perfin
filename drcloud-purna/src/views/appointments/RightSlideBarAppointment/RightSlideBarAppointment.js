// ** React Imports
import { useEffect, useState, useContext } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Camera, CheckSquare, Edit, Trash, X } from 'react-feather'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router'

import Toast from '@utility/toast'
import ScrollNav from '@components/ScrollNav'
import { getErrorMessage } from '@api/handleApiError'
import { getClinicAppointmentByIdAPI } from '@api/main'
import { reverseEnumObject } from '@utility/utils'
import { AppointmentStatusEnum, FrontEndScreenEnum, GenderEnum, KeyBoardEnum } from '@utility/constants'
import useKeypress from '@hooks/useKeyPress'
import { AbilityContext, Can } from '@utility/context/Can'

import OverviewTab from './OverviewTab'
import PatientInfoTab from './PatientInfo'
import HistoryTab from './HistoryTab'
import AvatarWrapper from '@components/AvatarWrapper'
import { startOfDay } from 'date-fns'

const xScreenId = FrontEndScreenEnum.Appointments

const RightSlideBarAppointment = ({ open, toggle, handleError403, appointmentId, refresh, onActionClick }) => {
  const [activeTab, setActiveTab] = useState('0')
  const [allowApprove, setAllowApprove] = useState(false)
  const [allowCheckIn, setAllowCheckIn] = useState(false)
  const [allowCancel, setAllowCancel] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)
  const [appointmentDetail, setAppointmentDetail] = useState()
  const navItems = [{ name: 'overview' }, { name: 'patientInfo' }, { name: 'appointmentHistory' }]
  const history = useHistory()
  const ability = useContext(AbilityContext)
  const intl = useIntl()

  const checkStatus = (statusId, startDateTime) => {
    setAllowApprove(statusId === AppointmentStatusEnum.NotApproved)
    setAllowCheckIn(statusId === AppointmentStatusEnum.Approved && new Date() > startOfDay(startDateTime))
    setAllowCancel(statusId < AppointmentStatusEnum.Finished || statusId === AppointmentStatusEnum.Invalid)
    setAllowEdit(statusId === AppointmentStatusEnum.NotApproved || statusId === AppointmentStatusEnum.Invalid)
  }

  useKeypress(KeyBoardEnum.Escape, () => {
    toggle()
  })

  useEffect(async () => {
    if (appointmentId) {
      try {
        const appointmentDetailRes = await getClinicAppointmentByIdAPI(appointmentId, xScreenId)
        setAppointmentDetail(appointmentDetailRes.data)
        checkStatus(appointmentDetailRes.data.appointmentStatusId, appointmentDetailRes.data.startDatetimeUnix)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        } else {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      }
    }
  }, [appointmentId, refresh])

  useEffect(() => {
    if (open) {
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.querySelector('body').style.overflow = 'auto'
    }
  }, [open])

  const openAppointmentDetail = async () => {
    await toggle()
    history.push({
      pathname: '/appointments/details',
      search: `?appointmentId=${appointmentId}`
    })
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <div
      className={classnames('right-slidebar', {
        show: open
      })}
    >
      <div className='right-slidebar-content'>
        <div className='right-slidebar-header px-2 pt-1 pb-0 position-relative'>
          <div className='d-flex align-items-center ml-0 mb-50'>
            <h6 className='text-secondary mb-0 mr-auto '>
              <FormattedMessage id='label.patient' defaultMessage='Patient' />
            </h6>
            <Can I={'write' || 'approve' || 'checkIn' || 'cancel'} a='appointments'>
              <UncontrolledButtonDropdown className='slide-bar-header-btn' size='sm'>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>
                {appointmentDetail && (
                  <DropdownMenu>
                    <Can I={'write' || 'approve'} a='appointments'>
                      <DropdownItem tag='a' onClick={() => onActionClick('approve')} disabled={!allowApprove}>
                        <CheckSquare className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.approve' defaultMessage='Approve' />
                        </span>
                      </DropdownItem>
                    </Can>
                    <Can I={'write' || 'checkIn'} a='appointments'>
                      <DropdownItem tag='a' onClick={() => onActionClick('checkin')} disabled={!allowCheckIn}>
                        <Camera className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.checkIn' defaultMessage='Check In' />
                        </span>
                      </DropdownItem>
                    </Can>

                    <Can I={'write' || 'cancel'} a='appointments'>
                      <DropdownItem tag='a' onClick={() => onActionClick('cancel')} disabled={!allowCancel}>
                        <Trash className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                        </span>
                      </DropdownItem>
                    </Can>

                    <DropdownItem tag='a' onClick={() => onActionClick('edit')} disabled={!allowEdit}>
                      <Edit className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.edit' defaultMessage='Edit' />
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </UncontrolledButtonDropdown>
            </Can>
            <Button className='px-1 py-50 slide-bar-header-btn' color='primary' onClick={openAppointmentDetail}>
              <FormattedMessage id='button.view' defaultMessage='View' />
            </Button>
            <X className='cursor-pointer' size={25} onClick={toggle} />
          </div>

          {appointmentDetail && (
            <AvatarWrapper
              imgUrl={appointmentDetail.patient.avatar?.fileUrl}
              title={appointmentDetail.patient.fullName}
              subTitle={`${intl.formatMessage({
                id: `enum.${reverseEnumObject(GenderEnum)[appointmentDetail.patient.gender || GenderEnum.Male]}`
              })} - ${new Date(appointmentDetail.patient.birthdayUnix).getFullYear()}`}
              size='lg'
            />
          )}

          <ScrollNav activeTab={activeTab} toggleTab={toggleTab} navItems={navItems} />
          <hr className='my-0' />
        </div>
        <ModalBody>
          {appointmentDetail && (
            <TabContent className='py-50' activeTab={activeTab}>
              <TabPane tabId='0'>
                <OverviewTab
                  appointmentDetail={appointmentDetail}
                  allowApprove={
                    allowApprove && (ability.can('write', 'appointments') || ability.can('approve', 'appointments'))
                  }
                  allowCheckIn={
                    allowCheckIn && (ability.can('write', 'appointments') || ability.can('checkIn', 'appointments'))
                  }
                  onActionClick={onActionClick}
                />
              </TabPane>
              <TabPane tabId='1'>
                <PatientInfoTab patient={appointmentDetail.patient} />
              </TabPane>
              <TabPane tabId='2'>
                <HistoryTab appointmentDetail={appointmentDetail} handleError403={handleError403} />
              </TabPane>
            </TabContent>
          )}
        </ModalBody>
      </div>
    </div>
  )
}

export default RightSlideBarAppointment
