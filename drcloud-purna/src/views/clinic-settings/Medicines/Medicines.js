import { useContext, useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

import { FrontEndScreenEnum } from '@utility/constants'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import { getMedicinesAPI, deleteMedicineAPI } from '@api/main'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import Dialog from '@utility/dialog'
import SearchInput from '@components/SearchInput'

import Table from './Table'
import EditMedicinesModal from './EditMedicinesModal'

const xScreenId = FrontEndScreenEnum.Medicines

const Medicines = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [medicineEditModalOpen, setMedicineEditModalOpen] = useState(false)
  const [medicine, setMedicine] = useState()

  const intl = useIntl()
  const ability = useContext(AbilityContext)

  const fetchData = async (pageSize, page, keyword) => {
    try {
      setLoading(true)
      const response = await getMedicinesAPI(pageSize, page, keyword, xScreenId)
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

  const openEditModal = data => {
    setMedicineEditModalOpen(true)
    setMedicine(data)
  }

  const openAddModal = () => {
    setMedicineEditModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setMedicine()
    setMedicineEditModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleDelete = async medicine => {
    try {
      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteMedicineTitle' }),
        text: intl.formatMessage({ id: 'dialog.deleteMedicineMessage' }, { name: medicine.medicineName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      // API call
      await deleteMedicineAPI(medicine.medicineId, xScreenId)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.medicineLibrary' defaultMessage='Medicine Library' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <div className='search-box'>
            <SearchInput onChange={handleSearch} />
          </div>
          <Can I={'write'} a='medicineLibrary'>
            <Button color='primary' size='md' onClick={() => openAddModal()}>
              <FormattedMessage id='button.add' defaultMessage='Add' />
            </Button>
          </Can>
        </div>
      </CardHeader>
      <CardBody>
        <Table
          progressPending={loading}
          paginationResetDefaultPage={refreshToggle}
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
          data={data}
          handleEdit={openEditModal}
          handleDelete={handleDelete}
        />
      </CardBody>
      {medicineEditModalOpen && (
        <EditMedicinesModal
          open={medicineEditModalOpen}
          isEditable={ability.can('write', 'medicineLibrary')}
          close={closeEditModal}
          handleError403={handleError403}
          medicine={medicine}
        />
      )}
    </Card>
  )
}

export default withAuthorization(Medicines, 'medicineLibrary', false)
