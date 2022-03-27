import { useContext, useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import DataTable from 'react-data-table-component'
import { Edit, Trash2, Eye, ChevronDown } from 'react-feather'

import { FrontEndScreenEnum, EntityTypeEnum } from '@utility/constants'
import { AbilityContext, Can } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import { getPropertiesAPI, deletePropertyAPI } from '@api/main'
import Select from '@components/Select'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import Dialog from '@utility/dialog'
import { enumToSelectOptions } from '@utility/utils'

import EditPropertiesModal from './EditPropertiesModal'
import noDataImg from '@assets/images/no-data.svg'

const xScreenId = FrontEndScreenEnum.Properties

const Properties = ({ handleError403 }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [propertyEditModalOpen, setPropertyEditModalOpen] = useState(false)
  const [property, setProperty] = useState()

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

  const fetchData = async entityTypeId => {
    try {
      setLoading(true)
      const response = await getPropertiesAPI(entityTypeId, xScreenId)
      setData(response.data)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(entityTypeId)
  }, [refreshToggle, entityTypeId])

  const openEditModal = data => {
    setPropertyEditModalOpen(true)
    setProperty(data)
  }

  const openAddModal = () => {
    setPropertyEditModalOpen(true)
  }

  const closeEditModal = modalResult => {
    setProperty()
    setPropertyEditModalOpen(false)
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle)
    }
  }

  const handleDelete = async property => {
    try {
      const dialogResult = await Dialog.showDanger({
        title: intl.formatMessage({ id: 'dialog.deletePropertyTitle' }),
        text: intl.formatMessage({ id: 'dialog.deletePropertyMessage' }, { name: property.propertyName }),
        confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
        cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
      })
      if (!dialogResult.isConfirmed) {
        return
      }
      // API call
      await deletePropertyAPI(property.propertyId, xScreenId)
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

  const EntitySelectColourStyles = {
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

  const propertyColumns = [
    {
      name: <FormattedMessage id='label.propertyName' defaultMessage='Property Name' />,
      minWidth: '200px',
      maxWidth: '550px',
      cell: row => <div data-tag='___react-data-table-allow-propagation___'>{row.propertyName}</div>
    },
    {
      name: <FormattedMessage id='label.propertyInternalName' defaultMessage='Internal Name' />,
      minWidth: '200px',
      maxWidth: '550px',
      cell: row => <div data-tag='___react-data-table-allow-propagation___'>{row.propertyInternalName}</div>
    },
    {
      name: <FormattedMessage id='label.action' defaultMessage='Action' />,
      minWidth: '50px',
      maxWidth: '100px',
      cell: row => (
        <div className='d-flex '>
          {!!row.isEditable ? (
            <>
              <Can I='write' a='properties'>
                <Edit size={15} className='icon-button' onClick={() => openEditModal(row)} />

                <Trash2 size={15} className='icon-button ml-1' onClick={() => handleDelete(row)} />
              </Can>

              <Can not I='write' a='properties'>
                <Eye size={15} className='icon-button ' onClick={() => openEditModal(row)} />
              </Can>
            </>
          ) : (
            <Eye size={15} className='icon-button ' onClick={() => openEditModal(row)} />
          )}
        </div>
      ),
      right: true
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id='title.properties' defaultMessage='Properties' />
        </CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          <Can I='write' a='properties'>
            <Button color='primary' size='md' onClick={() => openAddModal()}>
              <FormattedMessage id='button.add' defaultMessage='Add' />
            </Button>
          </Can>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm='3'>
            <FormGroup>
              <Select
                styles={EntitySelectColourStyles}
                id='entityTypeId'
                name='entityTypeId'
                control={control}
                maxMenuHeight={150}
                options={enumToSelectOptions(EntityTypeEnum)}
                getOptionLabel={option => (
                  <FormattedMessage id={`enum.${option.label}`} defaultMessage={option.label} />
                )}
              />
            </FormGroup>
          </Col>
        </Row>
        <DataTable
          data={data}
          progressPending={loading}
          columns={propertyColumns}
          highlightOnHover={true}
          className='react-dataTable'
          noHeader
          responsive={true}
          sortIcon={<ChevronDown size={10} />}
          noDataComponent={
            <div className='d-flex flex-column align-items-center my-2'>
              <img src={noDataImg} width='200' alt='no-data' />
              <FormattedMessage id='label.noData' defaultMessage='No data' />
            </div>
          }
          progressComponent={<FormattedMessage id='label.loading' defaultMessage='Loading...' />}
        />
      </CardBody>
      {propertyEditModalOpen && (
        <EditPropertiesModal
          open={propertyEditModalOpen}
          isEditable={ability.can('write', 'properties')}
          close={closeEditModal}
          handleError403={handleError403}
          property={property}
        />
      )}
    </Card>
  )
}

export default withAuthorization(Properties, 'properties', false)
