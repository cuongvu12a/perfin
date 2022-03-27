import { Fragment, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { CustomInput, Row, Col } from 'reactstrap'

// ** Styles
import '@core/scss/react/libs/tables/react-dataTable-component.scss'
import noDataImg from '@assets/images/no-data.svg'

// ** Custom Pagination Component
const CustomPagination = ({ rowsPerPage, rowCount, currentPage, onChangePage, onChangeRowsPerPage }) => {
  const numPages = Math.ceil(rowCount / rowsPerPage)
  const lastIndex = currentPage * rowsPerPage
  const firstIndex = lastIndex - rowsPerPage + 1

  return (
    <Row className='m-1'>
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
          onPageChange={page => onChangePage(page.selected + 1)}
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
  )
}

const BaseTable = ({ data, columns, pagination = true, ...rest }) => {
  return (
    <Fragment>
      <DataTable
        noHeader
        responsive={true}
        pagination={pagination}
        highlightOnHover={true}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        noDataComponent={
          <div className='d-flex flex-column align-items-center my-2'>
            <img src={noDataImg} width='200' alt='no-data' />
            <FormattedMessage id='label.noData' defaultMessage='No data' />
          </div>
        }
        progressComponent={<FormattedMessage id='label.loading' defaultMessage='Loading...' />}
        paginationComponent={CustomPagination}
        columns={columns}
        data={data}
        {...rest}
      />
    </Fragment>
  )
}

export default BaseTable
