import { useState, Fragment, useCallback, useEffect, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Row, Col, Card } from 'reactstrap'
import { Menu } from 'react-feather'
import { useHistory } from 'react-router'
// ** Component
import SidebarLeft from './SidebarLeft'
import classnames from 'classnames'
import Dialog from '@utility/dialog'
import QueueColumn from '@components/QueueColumn'
import { getTodayAppointmentQueueAPI, startAppointmentAPI, finishAppointmentAPI, cancelAppointmentAPI } from '@api/main'
import { AppointmentStatusEnum, FrontEndFeatureEnum, FrontEndScreenEnum, ScreenEnum } from '@utility/constants'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import ChangeDoctorModal from './ChangeDoctorModal'
import AppointmentCard from './AppointmentCard'

// ** Style
import '@core/scss/react/apps/app-calendar.scss'
import { AbilityContext } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const ClinicQueue = ({ handleError403 }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [timer, setTimer] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [checkedInList, setCheckedInList] = useState()
  const [inProgressList, setInProgressList] = useState()
  const [finishedList, setFinishedList] = useState()
  const [appointmentInfo, setAppointmentInfo] = useState()
  const [filter, setFilter] = useState({
    locationId: null,
    specialtyId: null,
    doctorId: null
  })

  const intl = useIntl()
  const history = useHistory()

  // ** ACL Ability Context
  const ability = useContext(AbilityContext)
  const toggleSidebar = useCallback(open => setLeftSidebarOpen(open), [])

  const fetchData = async filter => {
    try {
      setLoading(true)
      const res = await getTodayAppointmentQueueAPI(filter, xScreenId)

      //handle filter and order checkedInList
      let checkedIn = res.data.filter(
        appointment => appointment.appointmentStatusId === AppointmentStatusEnum.CheckedIn
      )
      checkedIn = checkedIn.sort((a, b) => {
        if (
          a.scheduleId &&
          a.actualCheckInDatetimeUnix < a.startDatetimeUnix &&
          (!b.scheduleId || b.actualCheckInDatetimeUnix > b.startDatetimeUnix)
        ) {
          return -1
        }
        if (
          (!a.scheduleId || a.actualCheckInDatetimeUnix > a.startDatetimeUnix) &&
          (!b.scheduleId || b.actualCheckInDatetimeUnix > b.startDatetimeUnix)
        ) {
          return a.actualCheckInDatetimeUnix - b.actualCheckInDatetimeUnix
        }
        if (
          a.scheduleId &&
          a.actualCheckInDatetimeUnix < a.startDatetimeUnix &&
          b.scheduleId &&
          b.actualCheckInDatetimeUnix < b.startDatetimeUnix
        ) {
          return a.startDatetimeUnix - b.startDatetimeUnix
        }
      })
      const firstBook = checkedIn.find(c => c.scheduleId)
      const indexOfFirstBook = checkedIn.indexOf(firstBook)
      const firstNoBook = checkedIn.find(c => !c.scheduleId || c.actualCheckInDatetimeUnix > c.startDatetimeUnix)
      const indexOfFirstNoBook = checkedIn.indexOf(firstNoBook)
      if (!firstNoBook) {
        setCheckedInList(checkedIn)
      } else {
        if (checkedIn[indexOfFirstBook]?.startDatetimeUnix - timer > 300000) {
          checkedIn.splice(indexOfFirstNoBook, 1)
          checkedIn.unshift(firstNoBook)
        } else {
          if (!checkedIn[0].scheduleId || checkedIn[0].actualCheckInDatetimeUnix > checkedIn[0].startDatetimeUnix) {
            checkedIn.shift()
            checkedIn.splice(indexOfFirstNoBook, 0, firstNoBook)
          }
        }
        setCheckedInList(checkedIn)
      }

      //handle filter and order inProgressList
      let inProgress = res.data.filter(
        appointment => appointment.appointmentStatusId === AppointmentStatusEnum.InProgress
      )
      inProgress = inProgress.sort((a, b) => b.actualStartDatetimeUnix - a.actualStartDatetimeUnix)
      setInProgressList(inProgress)

      //handle filter and order finishedList
      let finished = res.data.filter(appointment => appointment.appointmentStatusId === AppointmentStatusEnum.Finished)
      finished = finished.sort((a, b) => b.actualEndDatetimeUnix - a.actualEndDatetimeUnix)
      setFinishedList(finished)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(filter)
    const interval = setInterval(() => {
      setTimer(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [timer, refreshToggle])

  const handleSearch = useCallback(
    filterData => {
      setFilter(filterData)
      setRefreshToggle(!refreshToggle)
    },
    [refreshToggle, setFilter]
  )

  const openChangeDoctorModal = useCallback(data => {
    setAppointmentInfo(data)
  }, [])

  const closeChangeDoctorModal = modalResult => {
    setAppointmentInfo()
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleExamination = appointmentId => {
    history.push({
      pathname: '/clinic-queue/in-progress',
      search: `?appointmentId=${appointmentId}`
    })
  }

  // *Handel dropdown menu
  const handleActionClick = useCallback(
    async (action, appointment) => {
      if (action === 'change-doctor') {
        openChangeDoctorModal(appointment)
        return
      }

      try {
        // Update status
        switch (action) {
          case 'start':
            if (appointment.appointmentStatusId === AppointmentStatusEnum.CheckedIn) {
              await startAppointmentAPI(
                appointment.appointmentId,
                xScreenId,
                FrontEndFeatureEnum.StartFinishAppointment
              )
            }
            // add filter by skill later
            if (ability.can('read' || 'write', ScreenEnum[FrontEndScreenEnum.TodayExaminations])) {
              handleExamination(appointment.appointmentId)
            }
            break
          case 'finish':
            await finishAppointmentAPI(appointment.appointmentId, xScreenId, FrontEndFeatureEnum.StartFinishAppointment)
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
              { appointmentIds: [appointment.appointmentId], cancelReason: dialogResult.value },
              xScreenId,
              FrontEndFeatureEnum.CancelAppointment
            )
            break
          default:
            break
        }
        if (appointment.appointmentStatusId !== AppointmentStatusEnum.InProgress) {
          Toast.showSuccess('toast.success')
        }
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

  const handleDropCard = useCallback(
    async (columnTitle, item) => {
      try {
        const appointmentId = parseInt(item.id)
        // Update status
        switch (columnTitle) {
          case 'inProgress':
            await startAppointmentAPI(appointmentId, xScreenId, FrontEndFeatureEnum.StartFinishAppointment)

            break
          case 'finished':
            await finishAppointmentAPI(appointmentId, xScreenId, FrontEndFeatureEnum.StartFinishAppointment)
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

  const renderCard = appointment => {
    return (
      <div key={appointment.appointmentId} id={appointment.appointmentId}>
        <AppointmentCard
          appointment={appointment}
          onActionClick={action => handleActionClick(action, appointment)}
          isExaminationAccess={ability.can('read' || 'write', ScreenEnum[FrontEndScreenEnum.TodayExaminations])}
        />
      </div>
    )
  }

  return (
    <div>
      <Fragment>
        <div className='content-header d-flex justify-content-between row mb-2 pl-1'>
          <h2 className='content-header-title float-left mb-0'>
            <FormattedMessage id='title.todayExaminations' defaultMessage='Today Queue' />
          </h2>
        </div>
        <div className='app-calendar overflow-hidden border'>
          <Row noGutters>
            <Col
              id='app-calendar-sidebar'
              className={classnames('col app-calendar-sidebar flex-grow-0 d-flex flex-column', {
                show: leftSidebarOpen
              })}
            >
              <SidebarLeft onSearch={handleSearch} />
            </Col>

            <Col className='position-relative '>
              <div className='menu-toggle p-2'>
                <Row>
                  <Col sm='6' className='d-flex align-items-center py-50'>
                    <div className='menu-toggle ml-1' onClick={() => toggleSidebar(true)}>
                      <Menu />
                    </div>
                  </Col>
                </Row>
              </div>
              <Card className='with-sidebar kanban'>
                <div className='d-flex justify-content-between px-1 pb-1'>
                  {checkedInList && (
                    <QueueColumn
                      title='checkedIn'
                      group={{ name: 'checkedIn', put: [] }}
                      list={checkedInList}
                      isDisable={!(ability.can('write', 'todayExaminations') || ability.can('startFinish', 'appointments'))}
                      setList={setCheckedInList}
                      renderItem={item => renderCard(item)}
                    />
                  )}
                  {inProgressList && (
                    <QueueColumn
                      title='inProgress'
                      group={{ name: 'inProgress', put: ['checkedIn'] }}
                      list={inProgressList}
                      isDisable={!(ability.can('write', 'todayExaminations') || ability.can('startFinish', 'appointments'))}
                      setList={setInProgressList}
                      onAdd={e => handleDropCard('inProgress', e.item)}
                      renderItem={item => renderCard(item)}
                    />
                  )}
                  {finishedList && (
                    <QueueColumn
                      title='finished'
                      group={{ name: 'finished', put: ['inProgress'] }}
                      list={finishedList}
                      isDisable={!(ability.can('write', 'todayExaminations') || ability.can('startFinish', 'appointments'))}
                      setList={setFinishedList}
                      onAdd={e => handleDropCard('finished', e.item)}
                      renderItem={item => renderCard(item)}
                    />
                  )}
                </div>
              </Card>
            </Col>

            <div
              className={classnames('body-content-overlay', {
                show: leftSidebarOpen === true
              })}
              onClick={() => toggleSidebar(false)}
            ></div>
          </Row>
        </div>
        {appointmentInfo && (
          <ChangeDoctorModal
            appointmentInfo={appointmentInfo}
            handleError403={handleError403}
            close={closeChangeDoctorModal}
          />
        )}
      </Fragment>
    </div>
  )
}

export default withAuthorization(ClinicQueue, 'todayExaminations')
