import { useState, useEffect, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Row,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  CardBody,
  CardTitle,
  Card
} from 'reactstrap'
import { Eye, EyeOff, Trash } from 'react-feather'
import classnames from 'classnames'
import Toast from '@utility/toast'
import Dialog from '@utility/dialog'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import { deleteDoctorAPI, getDoctorsAPI, updateDoctorEnableAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import BaseTable from '@components/BaseTable'
import SearchInput from '@components/SearchInput'
import EditDoctorsModal from './EditDoctorModal'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Doctors

const Doctors = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [doctorsModalOpen, setDoctorsModalOpen] = useState(false)
  const [doctor, setDoctor] = useState()

  const intl = useIntl()
  const ability = useContext(AbilityContext)

  const fetchData = async (pageSize, page, keyword) => {
    try {
      setLoading(true)
      const response = await getDoctorsAPI(pageSize, page, keyword, xScreenId)
      setData(response.data.pageData)
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
  }

  useEffect(async () => {
    fetchData(rowsPerPage, 1, keyword)
  }, [refreshToggle, keyword])

  const handleSearch = async value => {
    setKeyword(value)
    setRefreshToggle(!refreshToggle)
  }

  const handlePageChange = page => {
    fetchData(rowsPerPage, page, keyword)
  }

  const handleRowsPerPageChange = async (newPerPage, page) => {
    fetchData(newPerPage, page, keyword)
    setRowsPerPage(newPerPage)
  }

  const handleDelete = async doctor => {
    try {
      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteDoctorTitle' }),
        text: intl.formatMessage({ id: 'dialog.deleteDoctorMessage' }, { name: doctor.doctorName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }

      await deleteDoctorAPI(doctor.doctorId, xScreenId)
      Toast.showSuccess('toast.success')
      setRefreshToggle(!refreshToggle)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const handleSetEnabled = async doctor => {
    try {
      if (doctor.isEnabled === true) {
        const dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.disabledDoctorTitle' }),
          text: intl.formatMessage({ id: 'dialog.disabledDoctorMessage' }, { name: doctor.doctorName }),
          confirmButtonText: intl.formatMessage({ id: 'button.disable' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
        if (!dialogResult.isConfirmed) {
          return
        }
      }

      await updateDoctorEnableAPI(doctor.doctorId, { isEnabled: !doctor.isEnabled }, xScreenId)
      Toast.showSuccess('toast.success')
      setRefreshToggle(!refreshToggle)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const openEditModal = data => {
    setDoctor(data)
    setDoctorsModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setDoctor()
    setDoctorsModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const doctorsColumns = [
    {
      name: 'Name',
      minWidth: '200px',
      maxWidth: '400px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='item-name-wrapper'>
            <div className='item-name text-dark'>{row.doctorName}</div>
          </div>
          <div className='action-button-wrapper'>
            <Can I='write' a='doctors'>
              <UncontrolledButtonDropdown className='mr-75' size='sm'>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>
                <DropdownMenu>
                  {row.isEnabled && (
                    <DropdownItem tag='a' onClick={e => handleSetEnabled(row)}>
                      <EyeOff className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.disable' defaultMessage='Disable' />
                      </span>
                    </DropdownItem>
                  )}
                  {!row.isEnabled && (
                    <DropdownItem tag='a' onClick={e => handleSetEnabled(row)}>
                      <Eye className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.enable' defaultMessage='Enable' />
                      </span>
                    </DropdownItem>
                  )}
                  <DropdownItem tag='a' onClick={e => handleDelete(row)}>
                    <Trash className='mr-50' size={15} />
                    <span className='align-middle'>
                      <FormattedMessage id='button.delete' defaultMessage='Delete' />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              <Button color='primary' size='sm' onClick={e => openEditModal(row)}>
                <FormattedMessage id='button.edit' defaultMessage='Edit' />
              </Button>
            </Can>
            <Can not I='write' a='doctors'>
              <Button color='primary' size='sm' onClick={e => openEditModal(row)}>
                <FormattedMessage id='button.view' defaultMessage='View' />
              </Button>
            </Can>
          </div>
        </div>
      )
    },
    {
      name: 'doctorCode',
      minWidth: '150px',
      maxWidth: '350px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.doctorCode' defaultMessage='Doctor Code' />
          </div>
          <div className='cell-content'>{row.doctorClinicCode || row.doctorCode}</div>
        </div>
      )
    },
    {
      name: 'specialty',
      minWidth: '100px',
      maxWidth: '200px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.specialty' defaultMessage='Specialty' />
          </div>
          <div className='cell-content'>{row.specialtyShortName || row.specialtyName}</div>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.doctors' defaultMessage='Doctors' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <div className='search-box'>
            <SearchInput onChange={handleSearch} />
          </div>
          <Can I='write' a='doctors'>
            <Button color='primary' size='md' onClick={() => openEditModal()}>
              <FormattedMessage id='button.add' defaultMessage='Add' />
            </Button>
          </Can>
        </div>
      </CardHeader>
      <CardBody>
        <BaseTable
          noTableHead={true}
          className='setting-table'
          paginationServer
          progressPending={loading}
          paginationResetDefaultPage={refreshToggle}
          paginationTotalRows={totalRows}
          columns={doctorsColumns}
          data={data}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
        />
      </CardBody>
      {doctorsModalOpen && (
        <EditDoctorsModal
          open={doctorsModalOpen}
          doctor={doctor}
          isEditable={ability.can('write', 'doctors')}
          close={closeEditModal}
          handleError403={handleError403}
        />
      )}
    </Card>
  )
}

export default withAuthorization(Doctors, 'doctors', false)
