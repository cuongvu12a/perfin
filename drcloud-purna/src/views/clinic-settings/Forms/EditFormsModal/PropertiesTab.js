import React, { Fragment, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col, FormGroup, Button } from 'reactstrap'
import { Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import { ChevronDown, Trash2, ChevronUp } from 'react-feather'
import { ReactSortable } from 'react-sortablejs'

import { getPropertiesAPI } from '@api/main'
import { arrayToSelectOptions, selectThemeColors } from '@utility/utils'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.Forms

const PropertiesTab = ({ isEditable, entityTypeId, propertyList, setPropertyList }) => {
  const [input, setInput] = useState('')
  const [inputSave, setInputSave] = useState('')

  const loadUsers = async keyword => {
    const response = await getPropertiesAPI(entityTypeId, xScreenId)
    return arrayToSelectOptions(response.data, 'propertyName', 'propertyId', 'propertyInternalName')
  }

  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.properties' defaultMessage='Properties' />
      </h3>

      <Row>
        <Col sm='5'>
          <FormGroup>
            <AsyncSelect
              key={entityTypeId}
              theme={selectThemeColors}
              className='react-select'
              id='propertyId'
              classNamePrefix='select'
              defaultOptions
              maxMenuHeight={150}
              placeholder={
                inputSave || <FormattedMessage id='placeholder.addProperty' defaultMessage='Add a property...' />
              }
              value=''
              inputValue={input}
              onInputChange={setInput}
              onMenuClose={() => {
                setInput('')
                setInputSave('')
              }}
              onFocus={() => {
                setInput('')
                setInputSave('')
              }}
              blurInputOnSelect
              loadOptions={loadUsers}
              isDisabled={!isEditable}
              onChange={e => {
                const currentProp = {
                  propertyName: e.label,
                  propertyId: e.value,
                  propertyInternalName: e.condition
                }
                const checkDuplicate = obj => obj.propertyId === currentProp.propertyId
                if (!propertyList.some(checkDuplicate)) {
                  setPropertyList([...propertyList, currentProp])
                }
              }}
            />
          </FormGroup>
        </Col>
      </Row>

      <FormGroup className='react-dataTable'>
        <Row className='table-header mx-0'>
          <Col sm='5' className='table-header col '>
            <div className='header-name'>
              <FormattedMessage id='label.propertyName' defaultMessage='Property Name' />
            </div>
          </Col>
          <Col sm='5' className='table-header col '>
            <div className='header-name'>
              <FormattedMessage id='label.propertyInternalName' defaultMessage='Property Internale Name' />
            </div>
          </Col>
          <Col sm='2' className='table-header col d-flex justify-content-end pr-1'>
            <div className='header-name'>
              <FormattedMessage id='label.action' defaultMessage='Action' />
            </div>
          </Col>
        </Row>

        <ReactSortable handle='.handle' ghostClass='bg-light-primary' list={propertyList} setList={setPropertyList}>
          {propertyList.map((row, index) => (
            <Row key={index} className='border border-right-0 border-left-0 border-top-0 bg-white mx-0'>
              <Col sm='5' className='p-0'>
                <div className='table-cell pl-25'>
                  {isEditable && (
                    <div className='d-flex flex-column handle icon-button sort-button'>
                      <ChevronUp size={12} />
                      <ChevronDown size={12} />
                    </div>
                  )}

                  <h6 className='mb-0 ml-25 appointment-table-cell cell-name'>{row.propertyName}</h6>
                </div>
              </Col>
              <Col sm='5' className='p-0'>
                <div className='table-cell'>
                  <h6 className='mb-0 appointment-table-cell cell-name'>{row.propertyInternalName}</h6>
                </div>
              </Col>
              <Col sm='2' className='p-0'>
                <div className='table-cell d-flex justify-content-end'>
                  {isEditable && (
                    <Trash2
                      size={15}
                      className='icon-button '
                      onClick={() => {
                        const newList = propertyList.filter(id => id !== row)
                        setPropertyList(newList)
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </ReactSortable>
      </FormGroup>
    </Fragment>
  )
}

export default PropertiesTab
