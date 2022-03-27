import { useEffect, useState, useCallback, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  UncontrolledButtonDropdown,
  Badge
} from 'reactstrap'
import { Eye, EyeOff, Key, Trash, Mail } from 'react-feather'
import classnames from 'classnames'
import debounce from 'lodash.debounce'
import { useSelector } from 'react-redux'

import Toast from '@utility/toast'
import { RoleTypeEnum, UserStatusDisplayConfig, UserStatusEnum, FrontEndScreenEnum } from '@utility/constants'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import {
  updateUserEnableAPI,
  getUserAccountsAPI,
  deleteUserAccountAPI,
  changeClinicOwnerAPI,
  reinviteUserAPI
} from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import BaseTable from '@components/BaseTable'
import SearchInput from '@components/SearchInput'
import Dialog from '@utility/dialog'
import InviteUserModal from './InviteUserModal'
import EditUserModal from './EditUserModal'

const xScreenId = FrontEndScreenEnum.Users

const UserAccounts = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editModalData, setEditModalData] = useState(null)

  const intl = useIntl()
  const ability = useContext(AbilityContext)
  const { userId } = useSelector(state => state.auth.userData)
  const { clinicOwnerUserId } = useSelector(state => state.auth.clinicData)
  const isOwner = userId === clinicOwnerUserId

  const fetchData = useCallback(
    debounce(async (pageSize, page, keyword) => {
      try {
        setLoading(true)
        const response = await getUserAccountsAPI(pageSize, page, keyword, xScreenId)
        setData(response.data.pageData)
        setTotalRows(response.data.paging.totalItem)
      } catch (error) {
        if (error.response?.metadata?.message[0]?.code === 'PINT_403') {
          handleError403(error.config.url)
        }
        Toast.showError('toast.error', getErrorMessage(error))
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

  const handleDelete = async employee => {
    try {
      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteUserTitle' }),
        text: intl.formatMessage(
          { id: 'dialog.deleteUserMessage' },
          { name: employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.userName }
        ),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      await deleteUserAccountAPI(employee.employeeId, xScreenId)
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

  const handleSetEnabled = async employee => {
    try {
      if (employee.isEnabled === true) {
        const dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.disabledUserTitle' }),
          text: intl.formatMessage(
            { id: 'dialog.disabledUserMessage' },
            { name: employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.userName }
          ),
          confirmButtonText: intl.formatMessage({ id: 'button.disable' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
        if (!dialogResult.isConfirmed) {
          return
        }
      }

      await updateUserEnableAPI(employee.employeeId, { isEnabled: !employee.isEnabled }, xScreenId)
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

  const handleChangeClinicOwner = async employee => {
    try {
      const dialogResult = await Dialog.showQuestion({
        title: intl.formatMessage({ id: 'dialog.changeClinicOwnerTitle' }),
        text: intl.formatMessage(
          { id: 'dialog.changeClinicOwnerMessage' },
          { name: employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.userName }
        )
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      await changeClinicOwnerAPI({ employeeId: employee.employeeId }, xScreenId)
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

  const handleResend = async employee => {
    try {
      await reinviteUserAPI(employee.employeeId, xScreenId)
      Toast.showSuccess('toast.success')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  const openInviteModal = () => {
    setInviteModalOpen(true)
  }

  const closeInviteModal = modalResult => {
    setInviteModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const openEditModal = data => {
    setEditModalData(data)
    setEditModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setEditModalOpen(false)
    setEditModalData()
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const userAccountsColumns = [
    {
      name: 'Name',
      minWidth: '200px',
      maxWidth: '700px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='item-name-wrapper'>
            <div className='item-name text-dark'>
              {row.firstName ? `${row.firstName} ${row.lastName}` : row.userName}
            </div>
          </div>
          <div className='action-button-wrapper'>
            <Can I='write' a='users'>
              {userId !== row.userId && row.roleTypeId !== RoleTypeEnum.Owner && (
                <UncontrolledButtonDropdown className='mr-75' size='sm'>
                  <DropdownToggle outline color='primary' caret className='bg-white'>
                    <FormattedMessage id='button.actions' defaultMessage='Actions' />
                  </DropdownToggle>
                  <DropdownMenu>
                    <>
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
                      {row.status === UserStatusEnum.Inactive && (
                        <DropdownItem tag='a' onClick={e => handleResend(row)}>
                          <Mail className='mr-50' size={15} />
                          <span className='align-middle'>
                            <FormattedMessage
                              id='button.resendInvitationEmail'
                              defaultMessage='Resend invitation email'
                            />
                          </span>
                        </DropdownItem>
                      )}
                      {row.status === UserStatusEnum.Active && row.isEnabled && isOwner && (
                        <DropdownItem tag='a' onClick={() => handleChangeClinicOwner(row)}>
                          <Key className='mr-50' size={15} />
                          <span className='align-middle'>
                            <FormattedMessage id='button.transferOwnership' defaultMessage='Set As Owner' />
                          </span>
                        </DropdownItem>
                      )}
                      <DropdownItem tag='a' onClick={() => handleDelete(row)}>
                        <Trash className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.delete' defaultMessage='Delete' />
                        </span>
                      </DropdownItem>
                    </>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              )}

              <Button color='primary' size='sm' onClick={() => openEditModal(row)}>
                {row.roleTypeId === RoleTypeEnum.Owner && !isOwner ? (
                  <FormattedMessage id='button.view' defaultMessage='View' />
                ) : (
                  <FormattedMessage id='button.edit' defaultMessage='Edit' />
                )}
              </Button>
            </Can>
            <Can not I='write' a='users'>
              <Button color='primary' size='sm' onClick={() => openEditModal(row)}>
                <FormattedMessage id='button.view' defaultMessage='View' />
              </Button>
            </Can>
          </div>
        </div>
      )
    },
    {
      name: 'Role',
      minWidth: '150px',
      maxWidth: '200px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.role' defaultMessage='Role' />
          </div>
          <div className='cell-content'>{row.roleName}</div>
        </div>
      )
    },
    {
      name: 'Status',
      minWidth: '150px',
      maxWidth: '200px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted'>
            <FormattedMessage id='label.status' defaultMessage='Status' />
          </div>
          <div className='cell-content'>
            <Badge
              data-tag='___react-data-table-allow-propagation___'
              className='mt-50'
              color={UserStatusDisplayConfig[row.status]?.color}
              pill
            >
              <FormattedMessage
                id={`enum.${UserStatusDisplayConfig[row.status]?.title}`}
                defaultMessage={`${UserStatusDisplayConfig[row.status]?.title}`}
              />
            </Badge>
          </div>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.users' defaultMessage='Users' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <div className='search-box'>
            <SearchInput onChange={handleSearch} />
          </div>
          <Can I='write' a='users'>
            <Button color='primary' size='md' onClick={() => openInviteModal()}>
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
          columns={userAccountsColumns}
          data={data}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
        />
      </CardBody>
      {inviteModalOpen && <InviteUserModal open={inviteModalOpen} close={closeInviteModal} />}
      {editModalOpen && (
        <EditUserModal
          open={editModalOpen}
          isOwner={isOwner}
          hasRoleWrite={ability.can('write', 'doctors')}
          close={closeEditModal}
          handleError403={handleError403}
          employee={editModalData}
        />
      )}
    </Card>
  )
}

export default withAuthorization(UserAccounts, 'users', false)
