import { Fragment, useState, useEffect, useCallback } from 'react'
import { Camera, CheckSquare, Edit, Trash } from 'react-feather'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown
} from 'reactstrap'
import Row from 'reactstrap/lib/Row'
import { startOfDay } from 'date-fns'

import UILoader from '@core/components/ui-loader'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import Dialog from '@utility/dialog'
import { AppointmentStatusEnum, FrontEndFeatureEnum, FrontEndScreenEnum } from '@utility/constants'
import {
  getClinicAppointmentByIdAPI,
  approveAppointmentAPI,
  checkInAppointmentAPI,
  cancelAppointmentAPI
} from '@api/main'
import useQuery from '@hooks/useQuery'
import { Can } from '@utility/context/Can'

import HistoryTab from './RightSlideBarAppointment/HistoryTab'
import PatientInfoTab from './RightSlideBarAppointment/PatientInfo'
import OverviewTab from './RightSlideBarAppointment/OverviewTab'
import EditAppointmentModal from './EditAppointmentModal'
import withAuthorization from '@hoc/withAuthorization'

const xScreenId = FrontEndScreenEnum.Appointments

const AppointmentDetail = ({ handleError403 }) => {
  const query = useQuery()
  const appointmentId = Number(query.get('appointmentId'))
  const intl = useIntl()

  const [appointmentDetail, setAppointmentDetail] = useState()
  const [activeTab, setActiveTab] = useState('1')
  const [allowApprove, setAllowApprove] = useState(false)
  const [allowCheckIn, setAllowCheckIn] = useState(false)
  const [allowCancel, setAllowCancel] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)

  const checkStatus = (statusId, startDateTime) => {
    setAllowApprove(statusId === AppointmentStatusEnum.NotApproved)
    setAllowCheckIn(statusId === AppointmentStatusEnum.Approved && new Date() > startOfDay(startDateTime))
    setAllowCancel(statusId < AppointmentStatusEnum.Finished || statusId === AppointmentStatusEnum.Invalid)
    setAllowEdit(statusId === AppointmentStatusEnum.NotApproved || statusId === AppointmentStatusEnum.Invalid)
  }

  useEffect(async () => {
    try {
      setIsLoading(true)
      const res = await getClinicAppointmentByIdAPI(appointmentId, xScreenId)
      setAppointmentDetail(res.data)
      checkStatus(res.data.appointmentStatusId, res.data.startDatetimeUnix)
      setIsLoading(false)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [refreshToggle])

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const openEditModal = useCallback(() => {
    setAppointmentModalOpen(true)
  }, [])

  const closeEditModal = modalResult => {
    setAppointmentModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  // *Handle action dropdown menu
  const handleActionClick = useCallback(
    async action => {
      if (action === 'edit') {
        openEditModal()
        return
      }

      try {
        // Update status
        switch (action) {
          case 'approve':
            await approveAppointmentAPI(
              { appointmentIds: [appointmentId] },
              xScreenId,
              FrontEndFeatureEnum.ApproveAppointment
            )
            break
          case 'checkin':
            // NOTE: Backend cancels late check-in automatically and prevents late check-in at H+3mins
            // so we don't to prevent late check-in at frontend.
            await checkInAppointmentAPI(appointmentId, xScreenId, FrontEndFeatureEnum.CheckInAppointment)
            break
          case 'cancel':
            const dialogResult = await Dialog.showInputText({
              title: intl.formatMessage({ id: 'dialog.cancelAppointmentTitle' }),
              text: intl.formatMessage({ id: 'dialog.cancelAppointmentMessage' }),
              inputLabel: intl.formatMessage({ id: 'dialog.cancelAppointmentLabel' }),
              handleValidate: value => !value && intl.formatMessage({ id: 'dialog.inputDialogRequire' })
            })
            if (!dialogResult.isConfirmed) {
              return
            }
            await cancelAppointmentAPI(
              { appointmentIds: [appointmentId], cancelReason: dialogResult.value },
              xScreenId,
              FrontEndFeatureEnum.CancelAppointment
            )
            break
          default:
            break
        }

        Toast.showSuccess('toast.success')
        setRefreshToggle(!refreshToggle)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        } else {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      }
    },
    [refreshToggle]
  )

  return (
    <Fragment>
      <UILoader className='detail-component' blocking={isLoading}>
        <div className='header-detail'>
          <h6 className='text-secondary mb-40 mr-auto '>
            <FormattedMessage id='label.appointment' defaultMessage='Appointment' />
          </h6>
          <h2 className='mb-0'>{appointmentDetail?.patient.fullName}</h2>
        </div>

        <Card className='detail-container'>
          <Row noGutters>
            <Col sm='3' xs='12' className='overview-detail'>
              <CardBody className='px-0'>
                <div className='header-overview-detail'>
                  <FormattedMessage id='title.overview' defaultMessage='Overview' />
                </div>
                {appointmentDetail && (
                  <div className='px-2 pt-1'>
                    <OverviewTab
                      appointmentDetail={appointmentDetail}
                      allowApprove={allowApprove}
                      allowCheckIn={allowCheckIn}
                      onActionClick={handleActionClick}
                    />
                  </div>
                )}
              </CardBody>
            </Col>
            <Col sm='9' xs='12'>
              <CardHeader className='header-container'>
                <Row className='w-100'>
                  <Col sm='6'>
                    <Nav tabs className='slide-bar-tabs mb-0'>
                      <NavItem>
                        <NavLink
                          className='nav-header'
                          active={activeTab === '1'}
                          onClick={() => {
                            toggleTab('1')
                          }}
                        >
                          <FormattedMessage id='title.patientInfo' defaultMessage='Patient Info' />
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className='nav-header'
                          active={activeTab === '2'}
                          onClick={() => {
                            toggleTab('2')
                          }}
                        >
                          <FormattedMessage id='title.appointmentHistory' defaultMessage='History' />
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  {appointmentDetail?.startDatetimeUnix >= startOfDay(new Date()).valueOf() && (
                    <Col sm='6' className='d-flex align-items-center justify-content-sm-end m-50 m-sm-0 pr-50'>
                      <Can I={'write' || 'approve' || 'checkIn' || 'cancel'} a='appointments'>
                        <UncontrolledButtonDropdown className='mr-60' size='sm'>
                          <DropdownToggle outline color='primary' caret className='bg-white'>
                            <FormattedMessage id='button.actions' defaultMessage='Actions' />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <Can I={'write' || 'approve'} a='appointments'>
                              <DropdownItem
                                tag='a'
                                onClick={() => handleActionClick('approve')}
                                disabled={!allowApprove}
                              >
                                <CheckSquare className='mr-50' size={15} />
                                <span className='align-middle'>
                                  <FormattedMessage id='button.approve' defaultMessage='Approve' />
                                </span>
                              </DropdownItem>
                            </Can>

                            <Can I={'write' || 'checkIn'} a='appointments'>
                              <DropdownItem
                                tag='a'
                                onClick={() => handleActionClick('checkin')}
                                disabled={!allowCheckIn}
                              >
                                <Camera className='mr-50' size={15} />
                                <span className='align-middle'>
                                  <FormattedMessage id='button.checkIn' defaultMessage='Check In' />
                                </span>
                              </DropdownItem>
                            </Can>

                            <Can I={'write' || 'cancel'} a='appointments'>
                              <DropdownItem tag='a' onClick={() => handleActionClick('cancel')} disabled={!allowCancel}>
                                <Trash className='mr-50' size={15} />
                                <span className='align-middle'>
                                  <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                                </span>
                              </DropdownItem>
                            </Can>

                            <DropdownItem tag='a' onClick={openEditModal} disabled={!allowEdit}>
                              <Edit className='mr-50' size={15} />
                              <span className='align-middle'>
                                <FormattedMessage id='button.edit' defaultMessage='Edit' />
                              </span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </Can>
                    </Col>
                  )}
                </Row>
              </CardHeader>
              <CardBody className='pt-50'>
                {appointmentDetail && (
                  <TabContent className='py-50' activeTab={activeTab}>
                    <TabPane tabId='1'>
                      <PatientInfoTab patient={appointmentDetail?.patient} />
                    </TabPane>
                    <TabPane tabId='2'>
                      <HistoryTab appointmentDetail={appointmentDetail} />
                    </TabPane>
                  </TabContent>
                )}
              </CardBody>
            </Col>
          </Row>
        </Card>
      </UILoader>
      {appointmentModalOpen && (
        <EditAppointmentModal
          open={appointmentModalOpen}
          appointmentId={appointmentDetail?.appointmentId}
          close={closeEditModal}
          mode={'update'}
        />
      )}
    </Fragment>
  )
}

export default withAuthorization(AppointmentDetail, 'appointments')
