import { Fragment, useCallback, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, Row } from 'reactstrap'
import classnames from 'classnames'
import debounce from 'lodash.debounce'

import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import withAuthorization from '@hoc/withAuthorization'
import { searchMedicalRecordsAPI } from '@api/main'
import { FrontEndScreenEnum, ScreenEnum } from '@utility/constants'

import SidebarLeft from './SidebarLeft'
import Table from './Table'
import EditMedicalRecord from './EditMedicalRecord'
import RightSlidebarPatient from './RightSlidebarPatient'

// ** Styles
import '@core/scss/react/apps/app-calendar.scss'

const xScreenId = FrontEndScreenEnum.MedicalRecords

const MedicalRecords = ({ handleError403 }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSlidebarOpen, setRightSlidebarOpen] = useState(false)
  const [medicalRecordModalOpen, setMedicalRecordModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedPage, setSelectedPage] = useState(1)
  const [filter, setFilter] = useState({
    keyword: '',
    patientCode: null,
    gender: null,
    yearOfBirth: 0
  })
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [patientListing, setPatientListing] = useState()
  const [selectedPatients, setSelectedPatients] = useState([])
  const [patient, setPatient] = useState(null)
  const [toggleClearSelectedRow, setToggleClearSelectedRow] = useState(false)

  const toggleSidebar = useCallback(open => setLeftSidebarOpen(open), [])

  const fetchData = useCallback(
    debounce(async (pageSize, page, filter) => {
      try {
        setLoading(true)
        const response = await searchMedicalRecordsAPI(pageSize, page, filter, xScreenId)
        setPatientListing(response.data.pageData)
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
    }, 400),
    []
  )

  useEffect(() => {
    fetchData(rowsPerPage, selectedPage, filter)
  }, [refreshToggle, filter, rowsPerPage, selectedPage])

  const handleSearch = useCallback(filterData => {
    setFilter(filterData)
    setSelectedPage(1)
  }, [])

  const handleChangeSelectedRow = useCallback(selectedRow => {
    setPatient(selectedRow.selectedRows[0])
    setSelectedPatients(selectedRow.selectedRows)
  }, [])

  const handlePageChange = useCallback(page => {
    setSelectedPage(page)
  }, [])

  const handleRowsPerPageChange = useCallback(async (newPerPage, page) => {
    setSelectedPage(page)
    setRowsPerPage(newPerPage)
  }, [])

  const closeRightSlidebar = () => {
    setRightSlidebarOpen(false)
    setPatient(null)
  }

  const openPatientDetails = useCallback(
    data => {
      setPatient(data)
      setRightSlidebarOpen(true)
      if (data.clinicPatientId === patient?.clinicPatientId) {
        closeRightSlidebar()
      }
    },
    [patient]
  )

  const openEditModal = useCallback(() => {
    setMedicalRecordModalOpen(true)
  }, [])

  const closeEditModal = modalResult => {
    setMedicalRecordModalOpen(false)

    if (modalResult === 'SAVED') {
      fetchData(rowsPerPage, selectedPage, filter)
      setRefreshToggle(!refreshToggle)
    }
    setToggleClearSelectedRow(!toggleClearSelectedRow)
  }

  const conditionalRowStyles = [
    {
      when: row => row.clinicPatientId === patient?.clinicPatientId,
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
            <FormattedMessage id='title.medicalRecords' defaultMessage='Medical Records' />
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
            <Col className='position-relative'>
              <Table
                progressPending={loading}
                paginationResetDefaultPage={refreshToggle}
                paginationTotalRows={totalRows}
                data={patientListing}
                onRowClicked={openPatientDetails}
                onSelectedRowsChange={handleChangeSelectedRow}
                clearSelectedRows={toggleClearSelectedRow}
                onChangeRowsPerPage={handleRowsPerPageChange}
                onChangePage={handlePageChange}
                selectedPatients={selectedPatients}
                toggleSidebar={toggleSidebar}
                handleEdit={openEditModal}
                conditionalRowStyles={conditionalRowStyles}
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

        <RightSlidebarPatient
          open={rightSlidebarOpen}
          clinicPatientId={patient?.clinicPatientId}
          handleError403={handleError403}
          openEditModal={openEditModal}
          toggle={closeRightSlidebar}
          refresh={refreshToggle}
        />

        {medicalRecordModalOpen && (
          <EditMedicalRecord
            open={medicalRecordModalOpen}
            patient={patient}
            handleError403={handleError403}
            close={closeEditModal}
          />
        )}
      </Fragment>
    </div>
  )
}

export default withAuthorization(MedicalRecords, ScreenEnum[FrontEndScreenEnum.MedicalRecords])
