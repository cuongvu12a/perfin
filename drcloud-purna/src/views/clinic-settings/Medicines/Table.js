import { Trash2, Eye, Edit } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import BaseTable from '@components/BaseTable'
import { Can } from '@utility/context/Can'

const Table = ({ handleEdit, handleDelete, ...rest }) => {
  const propertyColumns = [
    {
      name: <FormattedMessage id='label.medicineName' defaultMessage='Medicine Name' />,
      minWidth: '550px',
      maxWidth: '1100px',
      cell: row => <div data-tag='___react-data-table-allow-propagation___'>{row.medicineName}</div>
    },

    {
      name: <FormattedMessage id='label.action' defaultMessage='Action' />,
      minWidth: '50px',
      maxWidth: '100px',
      cell: row => (
        <div className='d-flex'>
          {!!row.isEditable ? (
            <>
              <Can I='write' a='properties'>
                <Edit size={15} className='icon-button' onClick={() => handleEdit(row)} />

                <Trash2 size={15} className='icon-button ml-1' onClick={() => handleDelete(row)} />
              </Can>

              <Can not I='write' a='properties'>
                <Eye size={15} className='icon-button ' onClick={() => handleEdit(row)} />
              </Can>
            </>
          ) : (
            <Eye size={15} className='icon-button ml-1' onClick={() => handleEdit(row)} />
          )}
        </div>
      ),
      right: true
    }
  ]

  return (
    <BaseTable
      // className='setting-table'
      paginationServer
      columns={propertyColumns}
      {...rest}
    />
  )
}

export default Table
