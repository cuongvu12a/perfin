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

import { getUserGroupsAPI, deleteUserGroupAPI, updateUserGroupEnableAPI } from '@api/main'
import Toast from '@utility/toast'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import BaseTable from '@components/BaseTable'
import SearchInput from '@components/SearchInput'
import Dialog from '@utility/dialog'
import AddUserGroupModal from './AddUserGroupModal'
import EditUserGroupModal from './EditUserGroupModal'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.UserGroups

const Groups = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [userGroupsEditModalOpen, setUserGroupsEditModalOpen] = useState(false)
  const [userGroupsAddModalOpen, setUserGroupsAddModalOpen] = useState(false)
  const [userGroups, setUserGroups] = useState()

  const intl = useIntl()
  const ability = useContext(AbilityContext)
  const userGroupIds = useSelector(state => state.auth.userData.userGroupIds)

  const fetchData = useCallback(
    debounce(async (pageSize, page, keyword) => {
      try {
        setLoading(true)
        const response = await getUserGroupsAPI(pageSize, page, keyword, xScreenId)
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
    setUserGroups(data)
    setUserGroupsEditModalOpen(true)
  }

  const openAddModal = () => {
    setUserGroupsAddModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setUserGroups()
    setUserGroupsEditModalOpen(false)
    setUserGroupsAddModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleDelete = async userGroup => {
    try {
      if (userGroupIds.includes(userGroup.userGroupId)) {
        await Dialog.showInfo({
          title: intl.formatMessage({ id: 'dialog.deleteGroupTitle' }),
          text: intl.formatMessage({ id: 'dialog.deleteGroupMessageHaveCurrentUser' })
        })
        return
      }

      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deleteGroupTitle' }),
        text: intl.formatMessage({ id: 'dialog.deleteGroupMessage' }, { name: userGroup.userGroupName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      // API call
      await deleteUserGroupAPI(userGroup.userGroupId, xScreenId)
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

  const handleSetEnabled = async userGroup => {
    try {
      if (userGroup.isEnabled === true) {
        if (userGroupIds.includes(userGroup.userGroupId)) {
          await Dialog.showInfo({
            title: intl.formatMessage({ id: 'dialog.disabledGroupTitle' }),
            text: intl.formatMessage({ id: 'dialog.disabledGroupMessageHaveCurrentUser' })
          })
          return
        }

        const dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.disabledGroupTitle' }),
          text: intl.formatMessage({ id: 'dialog.disabledGroupMessage' }, { name: userGroup.userGroupName }),
          confirmButtonText: intl.formatMessage({ id: 'button.disable' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
        if (!dialogResult.isConfirmed) {
          return
        }
      }
      // API call
      await updateUserGroupEnableAPI(userGroup.userGroupId, { isEnabled: !userGroup.isEnabled }, xScreenId)
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

  const userGroupsColumns = [
    {
      name: 'userGroupName',
      minWidth: '200px',
      maxWidth: '450px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='item-name-wrapper'>
            <div className='item-name text-dark'>{row.userGroupName}</div>
          </div>
          <div className='action-button-wrapper'>
            <Can I='write' a='groups'>
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
            <Can not I='write' a='groups'>
              <Button color='primary' size='sm' onClick={e => openEditModal(row)}>
                <FormattedMessage id='button.view' defaultMessage='View' />
              </Button>
            </Can>
          </div>
        </div>
      )
    },
    {
      name: 'user',
      minWidth: '100px',
      maxWidth: '150px',
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
      name: 'doctor',
      minWidth: '150px',
      maxWidth: '150px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted text'>
            <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
          </div>
          <div className='cell-content'>{row.doctorCount}</div>
        </div>
      )
    },
    {
      name: 'location',
      minWidth: '150px',
      maxWidth: '100px',
      cell: row => (
        <div
          className={classnames('cell-container', {
            'item-disabled': !row.isEnabled
          })}
        >
          <div className='cell-title text-muted text'>
            <FormattedMessage id='label.location' defaultMessage='Location' />
          </div>
          <div className='cell-content'>{row.locationCount}</div>
        </div>
      )
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.userGroups' defaultMessage='User Groups' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <div className='search-box'>
            <SearchInput onChange={handleSearch} />
          </div>

          <Can I='write' a='groups'>
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
          columns={userGroupsColumns}
          data={data}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
        />
      </CardBody>
      {userGroupsEditModalOpen && (
        <EditUserGroupModal
          open={userGroupsEditModalOpen}
          isEditable={ability.can('write', 'groups')}
          close={closeEditModal}
          userGroups={userGroups}
          handleError403={handleError403}
        />
      )}
      {userGroupsAddModalOpen && (
        <AddUserGroupModal open={userGroupsAddModalOpen} close={closeEditModal} openEditModal={openEditModal} />
      )}
    </Card>
  )
}

export default withAuthorization(Groups, 'groups', false)
