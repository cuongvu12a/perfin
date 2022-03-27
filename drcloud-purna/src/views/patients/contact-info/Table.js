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
import { Layers, Edit, Share, Trash2, Menu } from 'react-feather'
import XLSX from 'xlsx'

import { reverseEnumObject } from '@utility/utils'
import { GenderEnum, ScreenEnum, FrontEndScreenEnum } from '@utility/constants'
import BaseTable from '@components/BaseTable'
import { Can } from '@utility/context/Can'
import AvatarWrapper from '@components/AvatarWrapper'

const Table = ({ toggleSidebar, handleEdit, selectedPatients, handleDelete, handleMerge, ...rest }) => {
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
            title={row.patientName}
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
      name: <FormattedMessage id='title.phoneNumber' defaultMessage='Phone Number' />,
      minWidth: '100px',
      maxWidth: '255px',
      cell: row => (
        <div
          className='text-secondary font-weight-bold appointment-table-cell'
          data-tag='___react-data-table-allow-propagation___'
        >
          {row.phoneNumber}
        </div>
      )
    },
    {
      name: <FormattedMessage id='title.address' defaultMessage='Addresss' />,
      minWidth: '355px',
      maxWidth: '591px',
      cell: row => (
        <div
          className='text-secondary font-weight-bold appointment-table-cell'
          data-tag='___react-data-table-allow-propagation___'
        >
          {row.address}
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
                  <Can I='write' a={ScreenEnum[FrontEndScreenEnum.Contacts]}>
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

                  <Can I='write' a={ScreenEnum[FrontEndScreenEnum.Contacts]}>
                    <DropdownItem
                      tag='a'
                      onClick={() => handleMerge(selectedPatients)}
                      disabled={selectedPatients.length < 2}
                    >
                      <Layers className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.merge' defaultMessage='Merge' />
                      </span>
                    </DropdownItem>
                  </Can>

                  <Can I='write' a={ScreenEnum[FrontEndScreenEnum.Contacts]}>
                    <DropdownItem
                      tag='a'
                      onClick={() => handleDelete(...selectedPatients)}
                      disabled={selectedPatients.length > 1 || selectedPatients.length === 0}
                    >
                      <Trash2 className='mr-50' size={15} />
                      <span className='align-middle'>
                        <FormattedMessage id='button.delete' defaultMessage='Delete' />
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
