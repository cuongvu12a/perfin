import React, { useState, useEffect, useContext, useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { debounce } from 'lodash'
import classnames from 'classnames'
import { Eye, EyeOff, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'

import withAuthorization from '@hoc/withAuthorization'
import { getErrorMessage } from '@api/handleApiError'
import { getFormsAPI, deleteFormAPI, updateEnableFormAPI } from '@api/main'
import BaseTable from '@components/BaseTable'
import { EntityTypeEnum, FrontEndScreenEnum } from '@utility/constants'
import { AbilityContext, Can } from '@utility/context/Can'
import { enumToSelectOptions } from '@utility/utils'
import Toast from '@utility/toast'
import Select from '@components/Select'
import Dialog from '@utility/dialog'

import EditFormsModal from './EditFormsModal'

const xScreenId = FrontEndScreenEnum.Forms

const Forms = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formsEditModalOpen, setFormsEditModalOpen] = useState(false)
  const [form, setForm] = useState()

  const intl = useIntl()
  const ability = useContext(AbilityContext)

  const defaultValues = {
    entityTypeId: 3
  }

  const { control, watch } = useForm({
    mode: 'onChange',
    defaultValues
  })

  const entityTypeId = watch('entityTypeId')

  const fetchData = useCallback(
    debounce(async (pageSize, page, entityTypeId) => {
      try {
        setLoading(true)
        const response = await getFormsAPI(pageSize, page, entityTypeId, xScreenId)
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
    }, 400),
    []
  )

  useEffect(async () => {
    fetchData(rowsPerPage, 1, entityTypeId)
  }, [refreshToggle, entityTypeId])

  const handlePageChange = page => {
    fetchData(rowsPerPage, page, entityTypeId)
  }

  const handleRowsPerPageChange = async (newPerPage, page) => {
    fetchData(newPerPage, page, entityTypeId)
    setRowsPerPage(newPerPage)
  }

  const openAddModal = () => {
    setFormsEditModalOpen(true)
  }

  const openEditModal = data => {
    setForm(data)
    setFormsEditModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setForm()
    setFormsEditModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleDelete = async form => {
    try {
      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteFormTitle' }),
        text: intl.formatMessage({ id: 'dialog.deleteFormMessage' }, { name: form.formName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      // API call
      await deleteFormAPI(form.formId, xScreenId)
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

  const handleSetEnabled = async form => {
    try {
      if (form.isEnabled === true) {
        const dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.disabledFormTitle' }),
          text: intl.formatMessage({ id: 'dialog.disabledFormMessage' }, { name: form.formName }),
          confirmButtonText: intl.formatMessage({ id: 'button.disable' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
        if (!dialogResult.isConfirmed) {
          return
        }
      }
      // API call
      await updateEnableFormAPI(form.formId, { isEnabled: !form.isEnabled }, xScreenId)
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

  const colourStyles = {
    control: base => ({
      ...base,
      borderColor: '#7367f0 !important'
    }),
    singleValue: base => ({
      ...base,
      color: '#7367f0 !important'
    }),
    dropdownIndicator: base => ({
      ...base,
      color: '#7367f0 !important'
    })
  }

  const formsColumns = [
    {
      name: 'name',
      minWidth: '200px',
      maxWidth: '750px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='item-name-wrapper'>
            <div className='item-name text-dark'>{row.formName}</div>
          </div>

          <div className='action-button-wrapper'>
            <Can I='write' a='forms'>
              <UncontrolledButtonDropdown className='mr-75' size='sm'>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>
                <DropdownMenu>
                  {row.isEnabled && (
                    <DropdownItem tag='a' onClick={() => handleSetEnabled(row)}>
                      <EyeOff className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.disable' defaultMessage='Disable' />
                      </span>
                    </DropdownItem>
                  )}
                  {!row.isEnabled && (
                    <DropdownItem tag='a' onClick={() => handleSetEnabled(row)}>
                      <Eye className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.enable' defaultMessage='Enable' />
                      </span>
                    </DropdownItem>
                  )}
                  <DropdownItem tag='a' onClick={() => handleDelete(row)}>
                    <Trash2 className='mr-50' size={15} />
                    <span className='align-middle'>
                      <FormattedMessage id='button.delete' defaultMessage='Delete' />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              <Button color='primary' size='sm' onClick={() => openEditModal(row)}>
                <FormattedMessage id='button.edit' defaultMessage='Edit' />
              </Button>
            </Can>
            <Can not I='write' a='forms'>
              <Button color='primary' size='sm' onClick={e => openEditModal(row)}>
                <FormattedMessage id='button.view' defaultMessage='View' />
              </Button>
            </Can>
          </div>
        </div>
      )
    },
    {
      name: 'properties',
      minWidth: '150px',
      maxWidth: '350px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.properties' defaultMessage='Properties' />
          </div>
          <div className='cell-content'>
            {`${row.propertyCount} ${intl.formatMessage({ id: 'title.properties' })} `}{' '}
          </div>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.forms' defaultMessage='Forms' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <Can I='write' a='forms'>
            <Button color='primary' size='md' onClick={() => openAddModal()}>
              <FormattedMessage id='button.add' defaultMessage='Add' />
            </Button>
          </Can>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm='3'>
            <Select
              name='entityTypeId'
              id='entityTypeId'
              styles={colourStyles}
              options={enumToSelectOptions(EntityTypeEnum)}
              control={control}
              getOptionLabel={option => <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />}
            />
          </Col>
        </Row>
        <hr className='mb-0' />
        <BaseTable
          noTableHead={true}
          className='setting-table'
          paginationServer
          progressPending={loading}
          paginationResetDefaultPage={refreshToggle}
          paginationTotalRows={totalRows}
          columns={formsColumns}
          data={data}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
        />
      </CardBody>
      {formsEditModalOpen && (
        <EditFormsModal
          open={formsEditModalOpen}
          isEditable={ability.can('write', 'forms')}
          close={closeEditModal}
          handleError403={handleError403}
          form={form}
        />
      )}
    </Card>
  )
}

export default withAuthorization(Forms, 'forms', false)
