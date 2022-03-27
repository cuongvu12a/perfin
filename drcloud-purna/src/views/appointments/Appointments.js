import { Fragment, useState, useCallback, useEffect } from 'react'
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { endOfDay, startOfDay } from 'date-fns'

// ** Components
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import { FrontEndScreenEnum, FrontEndFeatureEnum } from '@utility/constants'
import withAuthorization from '@hoc/withAuthorization'
import Dialog from '@utility/dialog'
import SidebarLeft from './SidebarLeft'
import Table from './Table'
import EditAppointmentModal from './EditAppointmentModal'
import RightSlideBarAppointment from './RightSlideBarAppointment'
import {
  searchClinicAppointmentsAPI,
  getClinicAppointmentsHasInvalid,
  approveAppointmentAPI,
  cancelAppointmentAPI,
  checkInAppointmentAPI
} from '@api/main'

// ** Styles
import '@core/scss/react/apps/app-calendar.scss'

const xScreenId = FrontEndScreenEnum.Appointments

const Appoitments = ({ handleError403 }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSlidebarOpen, setRightSlidebarOpen] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedPage, setSelectedPage] = useState(1)
  const [filter, setFilter] = useState({
    keyword: '',
    locationId: null,
    specialtyId: null,
    doctorId: null,
    fromDate: startOfDay(new Date()).getTime(),
    toDate: endOfDay(new Date()).getTime()
  })
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [appointmentListing, setAppointmentListing] = useState()
  const [selectedAppointments, setSelectedAppointments] = useState([])
  const [appointment, setAppointment] = useState()
  const [appointmentMode, setAppointmentMode] = useState('') //mode: "create", "update"
  const [toggleClearSelectedRow, setToggleClearSelectedRow] = useState(false)
  const [hasInvalid, setHasInvalid] = useState(false)
  //Hooks
  const intl = useIntl()

  const toggleSidebar = useCallback(open => setLeftSidebarOpen(open), [])

  const fetchData = useCallback(async (pageSize, page, filter) => {
    try {
      setLoading(true)
      const response = await searchClinicAppointmentsAPI(pageSize, page, filter, xScreenId)
      const hasInvalidRes = await getClinicAppointmentsHasInvalid(xScreenId)
      setHasInvalid(hasInvalidRes.data.hasInvalid)
      setAppointmentListing(response.data.pageData)
      setTotalRows(response.data.paging.totalItem)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    filterData => {
      setFilter(filterData)
      setSelectedPage(1)
      setRefreshToggle(!refreshToggle)
      fetchData(rowsPerPage, 1, filterData)
    },
    [refreshToggle, rowsPerPage]
  )

  const handleChangeSelectedRow = useCallback(selectedRow => {
    setAppointment(selectedRow.selectedRows[0])
    setSelectedAppointments(selectedRow.selectedRows)
  }, [])

  const handlePageChange = useCallback(
    page => {
      setSelectedPage(page)
      fetchData(rowsPerPage, page, filter)
    },
    [rowsPerPage, filter]
  )

  const handleRowsPerPageChange = useCallback(
    async (newPerPage, page) => {
      setSelectedPage(page)
      setRowsPerPage(newPerPage)
      fetchData(newPerPage, page, filter)
    },
    [filter]
  )

  const closeRightSlidebar = () => {
    setRightSlidebarOpen(false)
    setAppointment(null)
  }

  const openAppointmentDetails = useCallback(
    data => {
      setAppointment(data)
      setRightSlidebarOpen(true)
      if (data.appointmentId === appointment?.appointmentId) {
        closeRightSlidebar()
      }
    },
    [appointment]
  )

  const openEditModal = useCallback(() => {
    setAppointmentMode('update')
    setAppointmentModalOpen(true)
  }, [])

  const openCreateModal = useCallback(() => {
    setAppointmentMode('create')
    closeRightSlidebar()
    setAppointmentModalOpen(true)
  }, [])

  const closeEditModal = modalResult => {
    setAppointmentModalOpen(false)
    if (appointmentMode === 'create') {
      setAppointment(null)
    }

    if (appointmentMode === 'update') {
      setAppointment(appointment)
    }

    if (modalResult === 'SAVED') {
      fetchData(rowsPerPage, selectedPage, filter)
      setRefreshToggle(!refreshToggle)
    }
    setToggleClearSelectedRow(!toggleClearSelectedRow)
  }

  // *Handle action dropdown menu
  const handleActionClick = useCallback(
    async (action, targetIds) => {
      if (action === 'edit') {
        openEditModal()
        return
      }

      try {
        // Update status
        switch (action) {
          case 'approve':
            await approveAppointmentAPI(
              { appointmentIds: targetIds },
              xScreenId,
              FrontEndFeatureEnum.ApproveAppointment
            )
            break
          case 'checkin':
            // NOTE: Backend cancels late check-in automatically and prevents late check-in at H+3mins
            // so we don't to prevent late check-in at frontend.
            await checkInAppointmentAPI(targetIds[0], xScreenId, FrontEndFeatureEnum.CheckInAppointment)
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
              { appointmentIds: targetIds, cancelReason: dialogResult.value },
              xScreenId,
              FrontEndFeatureEnum.CancelAppointment
            )
            break
          default:
            break
        }

        fetchData(rowsPerPage, selectedPage, filter)
        setRefreshToggle(!refreshToggle)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        } else {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      }
    },
    [rowsPerPage, selectedPage, filter, refreshToggle]
  )

  const conditionalRowStyles = [
    {
      when: row => row.appointmentId === appointment?.appointmentId,
      style: {
        backgroundColor: 'rgb(238, 238, 238)'
      }
    }
  ]

  return (
    <div>
      <Fragment>
        <div className='content-header d-flex justify-content-between row mb-2 pl-1'>
          <h2 className='content-header-title float-left mb-0'>
            <FormattedMessage id='title.appointments' defaultMessage='Appointments' />
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
              <SidebarLeft onAddClick={openCreateModal} onSearch={handleSearch} />
            </Col>
            <Col className='position-relative'>
              <Table
                progressPending={loading}
                paginationResetDefaultPage={refreshToggle}
                paginationTotalRows={totalRows}
                data={appointmentListing}
                onRowClicked={openAppointmentDetails}
                onSelectedRowsChange={handleChangeSelectedRow}
                onChangeRowsPerPage={handleRowsPerPageChange}
                clearSelectedRows={toggleClearSelectedRow}
                onChangePage={handlePageChange}
                selectedAppointments={selectedAppointments}
                toggleSidebar={toggleSidebar}
                conditionalRowStyles={conditionalRowStyles}
                hasInvalid={hasInvalid}
                onActionClick={action =>
                  handleActionClick(
                    action,
                    selectedAppointments.map(a => a.appointmentId)
                  )
                }
              />
            </Col>
            <div
              className={classnames('body-content-overlay', {
                show: leftSidebarOpen === true
              })}
              onClick={() => toggleSidebar(false)}
            ></div>
          </Row>
        </div>

        <RightSlideBarAppointment
          open={rightSlidebarOpen}
          appointmentId={appointment?.appointmentId}
          handleError403={handleError403}
          toggle={closeRightSlidebar}
          refresh={refreshToggle}
          onActionClick={action => appointment && handleActionClick(action, [appointment.appointmentId])}
        />

        {appointmentModalOpen && (
          <EditAppointmentModal
            open={appointmentModalOpen}
            appointmentId={appointment?.appointmentId}
            handleError403={handleError403}
            close={closeEditModal}
            mode={appointmentMode}
          />
        )}
      </Fragment>
    </div>
  )
}

export default withAuthorization(Appoitments, 'appointments')
