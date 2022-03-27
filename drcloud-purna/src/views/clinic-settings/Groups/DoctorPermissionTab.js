import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, CustomInput, FormGroup, Label, Row } from 'reactstrap'
import { Controller } from 'react-hook-form'
import classnames from 'classnames'
import ReactPaginate from 'react-paginate'
import UILoader from '@core/components/ui-loader'
import debounce from 'lodash.debounce'

import { getDoctorsAPI } from '@api/main'
import Select from '@components/Select'
import Toast from '@utility/toast'
import { FrontEndScreenEnum } from '@utility/constants'
import { getErrorMessage } from '@api/handleApiError'

const xScreenId = FrontEndScreenEnum.UserGroups

const DoctorPermissionTab = ({ control, isAllDoctors, isEditable }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowCount, setRowCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const numPages = Math.ceil(rowCount / rowsPerPage)
  const lastIndex = currentPage * rowsPerPage
  const firstIndex = lastIndex - rowsPerPage + 1

  const isAllDoctor = [
    { label: 'label.allDoctors', value: true },
    { label: 'label.limitedDoctors', value: false }
  ]

  const fetchData = useCallback(
    debounce(async (pageSize, page, keyword) => {
      try {
        setLoading(true)
        const response = await getDoctorsAPI(pageSize, page, keyword, xScreenId)
        setData(response.data.pageData)
        setRowCount(response.data.paging.totalItem)
      } catch (error) {
        Toast.showError('toast.error', getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }, 400),
    []
  )

  useEffect(async () => {
    fetchData(rowsPerPage, currentPage, '')
  }, [currentPage])

  const onChangeRowsPerPage = async (newPerPage, page) => {
    fetchData(newPerPage, page, '')
    setRowsPerPage(newPerPage)
  }

  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.doctorPermissions' defaultMessage='Doctor Permissions' />
      </h3>
      <Row>
        <Col sm='4'>
          <FormGroup className='mb-50'>
            <Select
              id='isAllDoctors'
              name='isAllDoctors'
              control={control}
              maxMenuHeight={150}
              options={isAllDoctor}
              getOptionLabel={option => <FormattedMessage id={option.label} defaultMessage={option.label} />}
              hideSelectedOptions
              isDisabled={!isEditable}
            />
          </FormGroup>
        </Col>
      </Row>
      <UILoader blocking={loading}>
        <Controller
          name='doctorIds'
          control={control}
          render={({ onChange, value }) => (
            <FormGroup>
              {data?.map(d => (
                <div key={`doctorIds[${d.doctorId}]`}>
                  <hr className='my-50' />
                  <div
                    className={classnames('clinic-groups-permission-items', {
                      'item-disabled': isAllDoctors
                    })}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <h6 className='mb-0 item-name'>{d.doctorName}</h6>
                      <div className='d-inline-flex text-center'>
                        <FormGroup className='mb-0 mr-2'>
                          <Label for='yes'>
                            <FormattedMessage id='enum.Yes' defaultMessage='Yes' />
                          </Label>
                          <div className='pl-50'>
                            <CustomInput
                              type='radio'
                              id={`${d.doctorId}.yes`}
                              checked={!!value.find(id => id === d.doctorId)}
                              onChange={e => {
                                onChange([...value, ...[d.doctorId]].sort((a, b) => (a > b && 1) || -1))
                              }}
                              disabled={isAllDoctors || !isEditable}
                            />
                          </div>
                        </FormGroup>

                        <FormGroup className='mb-0 mr-1'>
                          <Label for='no'>
                            <FormattedMessage id='enum.No' defaultMessage='No' />
                          </Label>
                          <div className='pl-50'>
                            <CustomInput
                              type='radio'
                              id={`${d.doctorId}.no`}
                              checked={!value.find(id => id === d.doctorId)}
                              onChange={e => {
                                const newIds = value.filter(id => id !== d.doctorId)
                                onChange(newIds)
                              }}
                              disabled={isAllDoctors || !isEditable}
                            />
                          </div>
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </FormGroup>
          )}
        />
        <hr className='my-50' />

        <Row className='m-0'>
          <Col md='6' className='d-flex align-items-center p-0 text-muted'>
            <FormattedMessage
              id='label.showingRangeOfRowCount'
              defaultMessage='Showing {firstIndex}-{lastIndex} of {rowCount}'
              values={{ firstIndex, lastIndex: currentPage === numPages ? rowCount : lastIndex, rowCount }}
            />
          </Col>
          <Col md='6' className='d-flex align-items-center justify-content-md-end p-0'>
            <ReactPaginate
              pageCount={rowCount / rowsPerPage}
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
            <div className='d-flex align-items-center'>
              <CustomInput
                bsSize='sm'
                className='form-control-sm ml-50 text-muted'
                type='select'
                id='rows-per-page'
                value={rowsPerPage}
                onChange={e => onChangeRowsPerPage(e.target.value, currentPage)}
              >
                <FormattedMessage id='label.rowsPerPage' defaultMessage='{num} rows' values={{ num: 10 }}>
                  {message => <option value={10}>{message}</option>}
                </FormattedMessage>
                <FormattedMessage id='label.rowsPerPage' defaultMessage='{num} rows' values={{ num: 20 }}>
                  {message => <option value={20}>{message}</option>}
                </FormattedMessage>
                <FormattedMessage id='label.rowsPerPage' defaultMessage='{num} rows' values={{ num: 50 }}>
                  {message => <option value={50}>{message}</option>}
                </FormattedMessage>
              </CustomInput>
            </div>
          </Col>
        </Row>
      </UILoader>
    </Fragment>
  )
}

export default DoctorPermissionTab
