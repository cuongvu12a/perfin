import React, { useEffect, useState } from 'react'
import { CustomInput } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { getUserGroupsAPI } from '@api/main'
import { Controller } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { FrontEndScreenEnum } from '@utility/constants'

const pageSize = 6
const xScreenId = FrontEndScreenEnum.Users

const UserGroupsTabContent = ({ isEditable, control }) => {
  const [userGroups, setUserGroups] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  useEffect(async () => {
    const res = await getUserGroupsAPI(pageSize, currentPage, '', xScreenId)
    setPageCount(res.data.paging.totalItem / pageSize)
    setUserGroups(res.data.pageData)
  }, [currentPage])

  return (
    <>
      <h2>
        <FormattedMessage id='title.userGroups' defaultMessage='User Groups' />
      </h2>
      <Controller
        control={control}
        name='userGroupIds'
        render={({ onChange, value }) => (
          <>
            {userGroups &&
              userGroups.map(group => (
                <div
                  key={group.userGroupId}
                  className='mt-1 pb-1 d-flex justify-content-between align-items-center border-bottom'
                >
                  <h6 className='mb-0'>{group.userGroupName}</h6>
                  <CustomInput
                    id={group.userGroupId}
                    type='switch'
                    className='custom-control-success'
                    checked={!!value.find(id => id === group.userGroupId)}
                    disabled={!isEditable}
                    onChange={e => {
                      let newIds = []
                      if (e.target.checked) {
                        newIds = [...value, ...[group.userGroupId]].sort()
                      } else {
                        newIds = value.filter(id => id !== group.userGroupId).sort()
                      }
                      onChange(newIds)
                    }}
                  />
                </div>
              ))}
          </>
        )}
      />

      {pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          nextLabel=''
          breakLabel='...'
          previousLabel=''
          activeClassName='active'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          forcePage={currentPage - 1}
          onPageChange={page => setCurrentPage(page.selected + 1)}
          pageClassName={'page-item'}
          nextLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousClassName={'page-item prev'}
          previousLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          containerClassName={'pagination react-paginate justify-content-end pt-1'}
        />
      )}
    </>
  )
}

export default UserGroupsTabContent
