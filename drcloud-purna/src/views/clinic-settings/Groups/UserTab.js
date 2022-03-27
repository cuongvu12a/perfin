import React, { Fragment, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col, FormGroup, Button } from 'reactstrap'
import { Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

import { getAllUserAccountsAPI } from '@api/main'
import { arrayToSelectOptions, selectThemeColors } from '@utility/utils'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.UserGroups

const UserTab = ({ control, isEditable }) => {
  const [input, setInput] = useState('')
  const [inputSave, setInputSave] = useState('')

  const loadUsers = async keyword => {
    const response = await getAllUserAccountsAPI(keyword, xScreenId)
    return arrayToSelectOptions(response, 'userName', 'userId')
  }

  return (
    <Fragment>
      <h3>
        <FormattedMessage id='title.users' defaultMessage='Users' />
      </h3>
      <Controller
        name='users'
        control={control}
        render={({ onChange, value }) => (
          <>
            <Row>
              <Col sm='5'>
                <FormGroup className='mb-50  '>
                  <AsyncSelect
                    theme={selectThemeColors}
                    className='react-select'
                    id='userId'
                    classNamePrefix='select'
                    defaultOptions
                    maxMenuHeight={150}
                    placeholder={
                      inputSave || <FormattedMessage id='placeholder.addUser' defaultMessage='Add a user...' />
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
                      const currentUser = {
                        userName: e.label,
                        userId: e.value
                      }
                      const checkDuplicate = obj => obj.userId === currentUser.userId
                      if (!value.some(checkDuplicate)) {
                        onChange([...value, currentUser].sort((a, b) => (a.userId > b.userId && 1) || -1))
                      }
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <hr />
              {value.map((row, index) => (
                <div key={index}>
                  <div className='d-flex align-items-center justify-content-between'>
                    <h6 className='mb-0'>{row.userName}</h6>

                    <Button
                      color='primary'
                      size='sm'
                      onClick={e => {
                        const newList = value.filter(id => id !== row)
                        onChange(newList)
                      }}
                    >
                      <FormattedMessage id='button.remove' defaultMessage='Remove' />
                    </Button>
                  </div>

                  <hr />
                </div>
              ))}
            </FormGroup>
          </>
        )}
      />
    </Fragment>
  )
}

export default UserTab
