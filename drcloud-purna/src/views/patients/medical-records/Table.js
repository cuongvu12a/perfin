// ** React Import
import { memo } from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Edit, Share, Menu } from 'react-feather'
import { format } from 'date-fns'
import XLSX from 'xlsx'

import { reverseEnumObject } from '@utility/utils'
import { GenderEnum } from '@utility/constants'
import BaseTable from '@components/BaseTable'
import { Can } from '@utility/context/Can'
import AvatarWrapper from '@components/AvatarWrapper'
const Table = ({ toggleSidebar, handleEdit, selectedPatients, ...rest }) => {
  const intl = useIntl()

  const handleExport = () => {
    const name = 'patients.xlsx'
    const wb = XLSX.utils.json_to_sheet(selectedPatients)
    const wbout = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wbout, wb, 'sheet1')
    XLSX.writeFile(wbout, name)
  }

  const patientsColumns = [
    {
      name: <FormattedMessage id='title.patientName' defaultMessage='Patient Name' />,
      minWidth: '200px',
      maxWidth: '455px',
      cell: row => (
        <div className='appointment-table-cell' data-tag='___react-data-table-allow-propagation___'>
          <AvatarWrapper
            imgUrl={row.avatar?.fileUrl}
            title={row.fullName}
            subTitle={`${intl.formatMessage({
              id: `enum.${reverseEnumObject(GenderEnum)[row.gender || GenderEnum.Male]}`
            })} - ${new Date(row.birthdayUnix).getFullYear()}`}
          />
        </div>
      )
    },
    {
      name: <FormattedMessage id='title.patientCode' defaultMessage='Patient Code' />,
      minWidth: '100px',
      maxWidth: '255px',
      cell: row => (
        <div
          className='text-secondary font-weight-bold appointment-table-cell'
          data-tag='___react-data-table-allow-propagation___'
        >
          {row.patientCode}
        </div>
      )
    },
    {
      name: <FormattedMessage id='title.birthday' defaultMessage='Birthday' />,
      minWidth: '200px',
      maxWidth: '455px',
      cell: row => (
        <div className='appointment-table-cell' data-tag='___react-data-table-allow-propagation___'>
          {format(row.birthdayUnix, 'dd/MM/yyyy')}
        </div>
      )
    },
    {
      name: <FormattedMessage id='title.height' defaultMessage='Height' />,
      minWidth: '40px',
      maxWidth: '255px',
      cell: row => (
        <div
          className='text-secondary font-weight-bold appointment-table-cell'
          data-tag='___react-data-table-allow-propagation___'
        >
          {row.heightInCm}
        </div>
      )
    },
    {
      name: <FormattedMessage id='title.weight' defaultMessage='Weight' />,
      minWidth: '40px',
      maxWidth: '255px',
      cell: row => (
        <div
          className='text-secondary font-weight-bold appointment-table-cell'
          data-tag='___react-data-table-allow-propagation___'
        >
          {row.weightInKg}
        </div>
      )
    }
  ]

  return (
    <Card className='with-sidebar'>
      <CardBody className='p-0'>
        <div className='d-block p-2'>
          <Row>
            <Col sm='6' className='d-flex align-items-center py-50'>
              <div className='menu-toggle ml-1' onClick={() => toggleSidebar(true)}>
                <Menu />
              </div>
            </Col>
            <Col sm='6' className='d-flex align-items-center justify-content-sm-end'>
              <UncontrolledButtonDropdown>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>
                <DropdownMenu right>
                  <Can I='write' a='medicalRecords'>
                    <DropdownItem
                      tag='a'
                      onClick={handleEdit}
                      disabled={selectedPatients.length > 1 || selectedPatients.length === 0}
                    >
                      <Edit className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.edit' defaultMessage='Edit' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <DropdownItem tag='a' onClick={handleExport} disabled={selectedPatients.length <= 0}>
                    <Share className='mr-50' size={15} />
                    <span className='align-middle'>
                      <FormattedMessage id='button.exportExcel' defaultMessage='Export Excel' />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </Col>
          </Row>
        </div>
        <BaseTable
          // className='setting-table'
          paginationServer
          selectableRows={true}
          columns={patientsColumns}
          {...rest}
        />
      </CardBody>
    </Card>
  )
}

export default memo(Table)
