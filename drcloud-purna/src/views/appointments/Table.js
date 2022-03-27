// ** React Import
import { memo, useState, useEffect } from 'react'
import {
  Alert,
  Badge,
  Card,
  CardBody,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { UserCheck, CheckSquare, Edit, Trash2, Menu, Share, AlertTriangle } from 'react-feather'
import { format, startOfDay } from 'date-fns'
import XLSX from 'xlsx'

import { AppointmentStatusDisplayConfig, AppointmentStatusEnum } from '@utility/constants'
import BaseTable from '@components/BaseTable'
import { Can } from '@utility/context/Can'

const appointmentColumns = [
  {
    name: <FormattedMessage id='label.date' defaultMessage='Date' />,
    maxWidth: '120px',
    cell: row => (
      <div data-tag='___react-data-table-allow-propagation___'>{format(row.startDatetimeUnix, 'dd/MM/yyyy')}</div>
    )
  },
  {
    name: <FormattedMessage id='label.time' defaultMessage='Time' />,
    maxWidth: '80px',
    cell: row => <div data-tag='___react-data-table-allow-propagation___'>{format(row.startDatetimeUnix, 'HH:mm')}</div>
  },
  {
    name: <FormattedMessage id='label.location' defaultMessage='Location' />,
    minWidth: '148px',
    maxWidth: '320px',
    cell: row => (
      <div className='font-weight-bold appointment-table-cell' data-tag='___react-data-table-allow-propagation___'>
        {row.locationName}
      </div>
    )
  },
  {
    name: <FormattedMessage id='label.patient' defaultMessage='Patient' />,
    minWidth: '148px',
    maxWidth: '320px',
    cell: row => (
      <div className='font-weight-bold appointment-table-cell' data-tag='___react-data-table-allow-propagation___'>
        {row.patientName}
      </div>
    )
  },
  {
    name: <FormattedMessage id='label.doctor' defaultMessage='Doctor' />,
    minWidth: '148px',
    maxWidth: '320px',
    cell: row => (
      <div className='font-weight-bold appointment-table-cell' data-tag='___react-data-table-allow-propagation___'>
        {row.doctorName}
      </div>
    )
  },
  {
    name: <FormattedMessage id='label.status' defaultMessage='Status' />,
    minWidth: '140px',
    maxWidth: '140px',
    cell: row => (
      <Badge
        className='badge-status-appointment'
        data-tag='___react-data-table-allow-propagation___'
        color={AppointmentStatusDisplayConfig[row.appointmentStatusId]?.color}
        pill
      >
        <FormattedMessage
          id={`enum.${AppointmentStatusDisplayConfig[row.appointmentStatusId]?.title}`}
          defaultMessage={`${AppointmentStatusDisplayConfig[row.appointmentStatusId]?.title}`}
        />
      </Badge>
    )
  }
]

const Table = ({ hasInvalid, selectedAppointments, toggleSidebar, onActionClick, ...rest }) => {
  const [allowApprove, setAllowApprove] = useState(false)
  const [allowCheckIn, setAllowCheckIn] = useState(false)
  const [allowCancel, setAllowCancel] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)

  useEffect(() => {
    // Change status rules:
    // 1. Not finished => can Cancel
    // 2. Cannot go backward
    // 3. If not go to Cancel => only forward ONE step
    setAllowApprove(
      selectedAppointments.length > 0 &&
        selectedAppointments.findIndex(ap => ap.appointmentStatusId !== AppointmentStatusEnum.NotApproved) < 0
    )
    setAllowCheckIn(
      selectedAppointments.length === 1 &&
        selectedAppointments[0].appointmentStatusId === AppointmentStatusEnum.Approved &&
        new Date() > startOfDay(selectedAppointments[0].startDatetimeUnix)
    )
    setAllowCancel(
      selectedAppointments.length > 0 &&
        selectedAppointments.findIndex(
          ap =>
            !(
              ap.appointmentStatusId < AppointmentStatusEnum.Finished ||
              ap.appointmentStatusId === AppointmentStatusEnum.Invalid
            )
        ) < 0
    )
    setAllowEdit(
      selectedAppointments.length === 1 &&
        (selectedAppointments[0].appointmentStatusId === AppointmentStatusEnum.NotApproved ||
          selectedAppointments[0].appointmentStatusId === AppointmentStatusEnum.Invalid)
    )
  }, [selectedAppointments])

  const handleExport = () => {
    const name = 'appointments.xlsx'
    const wb = XLSX.utils.json_to_sheet(selectedAppointments)
    const wbout = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wbout, wb, 'sheet1')
    XLSX.writeFile(wbout, name)
  }

  return (
    <Card className='with-sidebar appointment-table-container'>
      <CardBody className='p-0'>
        <div className='d-block p-2'>
          <Row>
            <Col sm='6' className='d-flex align-items-center py-50'>
              <div className='menu-toggle ml-1' onClick={() => toggleSidebar(true)}>
                <Menu />
              </div>
            </Col>
            <Col sm='6' className='d-flex align-items-center justify-content-sm-end'>
              <UncontrolledButtonDropdown>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>
                <DropdownMenu right>
                  <Can I={'write' || 'approve'} a='appointments'>
                    <DropdownItem tag='a' onClick={() => onActionClick('approve')} disabled={!allowApprove}>
                      <CheckSquare className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.approve' defaultMessage='Approve' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <Can I={'write' || 'checkIn'} a='appointments'>
                    <DropdownItem tag='a' onClick={e => onActionClick('checkin')} disabled={!allowCheckIn}>
                      <UserCheck className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.checkIn' defaultMessage='Check In' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <Can I={'write' || 'cancel'} a='appointments'>
                    <DropdownItem tag='a' onClick={() => onActionClick('cancel')} disabled={!allowCancel}>
                      <Trash2 className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <Can I='write' a='appointments'>
                    <DropdownItem tag='a' onClick={() => onActionClick('edit')} disabled={!allowEdit}>
                      <Edit className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.edit' defaultMessage='Edit' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <DropdownItem tag='a' onClick={handleExport} disabled={selectedAppointments.length <= 0}>
                    <Share className='mr-50' size={15} />
                    <span className='align-middle'>
                      <FormattedMessage id='button.exportExcel' defaultMessage='Export Excel' />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </Col>
            {hasInvalid && (
              <Col>
                <Alert className='mt-1 mb-0' color='warning'>
                  <div className='alert-body'>
                    <AlertTriangle size={15} />
                    <span className='ml-1'>
                      <FormattedMessage id='appointments.warningInvalidAppointment' />
                    </span>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        </div>
        <BaseTable
          // className='setting-table'
          paginationServer
          selectableRows={true}
          columns={appointmentColumns}
          {...rest}
        />
      </CardBody>
    </Card>
  )
}

export default memo(Table)
