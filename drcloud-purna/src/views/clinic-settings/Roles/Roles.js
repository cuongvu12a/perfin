import { useEffect, useState, useCallback, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Row,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { Eye, EyeOff, Trash } from 'react-feather'
import classnames from 'classnames'
import { getErrorMessage } from '@api/handleApiError'
import debounce from 'lodash.debounce'
import { useSelector } from 'react-redux'

import { getRolesAPI, deleteRolesAPI, updateRolesEnableAPI } from '@api/main'
import { RoleTypeEnum, FrontEndScreenEnum } from '@utility/constants'
import Dialog from '@utility/dialog'
import { reverseEnumObject } from '@utility/utils'
import Toast from '@utility/toast'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import BaseTable from '@components/BaseTable'
import SearchInput from '@components/SearchInput'

import EditRoleModal from './EditRoleModal'
import AddRoleModal from './AddRoleModal'

const xScreenId = FrontEndScreenEnum.UserRoles

const Roles = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rolesEditModalOpen, setRolesEditModalOpen] = useState(false)
  const [rolesAddModalOpen, setRolesAddModalOpen] = useState(false)
  const [role, setRole] = useState()

  const intl = useIntl()
  const ability = useContext(AbilityContext)
  const userRoleId = useSelector(state => state.auth.userData.userRoleId)

  const fetchData = useCallback(
    debounce(async (pageSize, page, keyword) => {
      try {
        setLoading(true)
        const response = await getRolesAPI(pageSize, page, keyword, xScreenId)
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
    setRole(data)
    setRolesEditModalOpen(true)
  }

  const openAddModal = () => {
    setRolesAddModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setRole()
    setRolesEditModalOpen(false)
    setRolesAddModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleDelete = async role => {
    try {
      if (userRoleId === role.roleId) {
        await Dialog.showInfo({
          title: intl.formatMessage({ id: 'dialog.deleteRoleTitle' }),
          text: intl.formatMessage({ id: 'dialog.deleteRoleMessageHaveCurrentUser' })
        })
        return
      }

      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteRoleTitle' }),
        text: intl.formatMessage({ id: 'dialog.deleteRoleMessage' }, { name: role.roleName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })

      if (!dialogResult.isConfirmed) {
        return
      }
      // API call
      await deleteRolesAPI(role.roleId, xScreenId)
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

  const handleSetEnabled = async role => {
    try {
      if (role.isEnabled === true) {
        if (userRoleId === role.roleId) {
          await Dialog.showInfo({
            title: intl.formatMessage({ id: 'dialog.disabledRoleTitle' }),
            text: intl.formatMessage({ id: 'dialog.disabledRoleMessageHaveCurrentUser' })
          })
          return
        }
        const dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.disabledRoleTitle' }),
          text: intl.formatMessage({ id: 'dialog.disabledRoleMessage' }, { name: role.roleName }),
          confirmButtonText: intl.formatMessage({ id: 'button.disable' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
        if (!dialogResult.isConfirmed) {
          return
        }
      }
      // API call
      await updateRolesEnableAPI(role.roleId, { isEnabled: !role.isEnabled }, xScreenId)
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

  const rolesColumns = [
    {
      name: 'name',
      minWidth: '200px',
      maxWidth: '700px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='item-name-wrapper'>
            <div className='item-name text-dark'>{row.roleName}</div>
          </div>

          {row.roleTypeId !== RoleTypeEnum.Owner && ability.can('write', 'roles') ? (
            <div className='action-button-wrapper'>
              {row.roleTypeId !== RoleTypeEnum.Admin && (
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
                      <Trash className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.delete' defaultMessage='Delete' />
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              )}
              <Button color='primary' size='sm' onClick={() => openEditModal(row)}>
                <FormattedMessage id='button.edit' defaultMessage='Edit' />
              </Button>
            </div>
          ) : (
            <div className='action-button-wrapper'>
              <Button color='primary' size='sm' onClick={() => openEditModal(row)}>
                <FormattedMessage id='button.view' defaultMessage='View' />
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      name: 'users',
      minWidth: '50px',
      maxWidth: '200px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.users' defaultMessage='Users' />
          </div>
          <div className='cell-content'>{row.userCount}</div>
        </div>
      )
    },
    {
      name: 'roleType',
      minWidth: '50px',
      maxWidth: '200px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.type' defaultMessage='Type' />
          </div>
          <div className='cell-content'>
            {intl.formatMessage({
              id: `enum.${reverseEnumObject(RoleTypeEnum)[row.roleTypeId]}`
            })}
          </div>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.userRoles' defaultMessage='User Roles' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <div className='search-box'>
            <SearchInput onChange={handleSearch} />
          </div>
          <Can I='write' a='roles'>
            <Button color='primary' size='md' onClick={() => openAddModal()}>
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
          columns={rolesColumns}
          data={data}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
        />
      </CardBody>
      {rolesEditModalOpen && (
        <EditRoleModal
          open={rolesEditModalOpen}
          isEditable={ability.can('write', 'roles')}
          close={closeEditModal}
          handleError403={handleError403}
          role={role}
        />
      )}
      {rolesAddModalOpen && (
        <AddRoleModal open={rolesAddModalOpen} close={closeEditModal} openEditModal={openEditModal} />
      )}
    </Card>
  )
}

export default withAuthorization(Roles, 'roles', false)
