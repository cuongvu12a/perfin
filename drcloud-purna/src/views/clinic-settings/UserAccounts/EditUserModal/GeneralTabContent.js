import React, { Fragment, useEffect, useState } from 'react'
import { Button, Media, Label, Row, Col, Input, FormGroup, Form } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import defaultAvatar from '@assets/images/avatar-blank.png'
import FormError from '@components/FormError'
import { FrontEndScreenEnum, KeyBoardEnum, RoleTypeEnum } from '@utility/constants'
import { getRolesAPI } from '@api/main'
import Select from '@components/Select'
import { arrayToSelectOptions } from '@utility/utils'

const xScreenId = FrontEndScreenEnum.Users

const GeneralTabContent = ({ register, errors, isEditable, isOwner, control, toggleTab }) => {
  const [avatar, setAvatar] = useState(defaultAvatar)
  const [roles, setRoles] = useState([])

  useEffect(async () => {
    const res = await getRolesAPI(50, 1, '', xScreenId)
    setRoles(res.data.pageData)
  }, [])

  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  return (
    <Fragment>
      <h2>
        <FormattedMessage id='title.generalSettings' defaultMessage='General Settings' />
      </h2>
      {/* <Media className='mt-75'>
        <Media className='mr-25' left>
          <Media
            object
            className='rounded-circle mr-25'
            src={avatar}
            alt='Generic placeholder image'
            height='80'
            width='80'
          />
        </Media>
        <Media className='mt-75 ml-1' body>
          <Button className='mr-75' size='sm' color='primary'>
            <FormattedMessage id='button.upload' defaultMessage='Upload' />
            <Input type='file' onChange={onChange} hidden accept='image/*' />
          </Button>
          <Button color='secondary' size='sm' outline>
            <FormattedMessage id='button.reset' defaultMessage='Reset' />
          </Button>
          <br />
          <div className='mt-75'>
            <FormattedMessage
              id='settings.imageDescription'
              defaultMessage='Allowed JPG, GIF or PNG. Max size of 800kB'
            />
          </div>
        </Media>
      </Media> */}
      <Row className='mt-2'>
        <Col sm='6'>
          <FormGroup>
            <Label for='firstName'>
              <FormattedMessage id='label.firstName' defaultMessage='First Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='firstName'
              name='firstName'
              autoFocus
              innerRef={register()}
              invalid={errors.firstName && true}
              disabled={!isEditable}
            />
            {errors && errors.firstName && <FormError>{errors.firstName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label for='lastName'>
              <FormattedMessage id='label.lastName' defaultMessage='Last Name' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='lastName'
              name='lastName'
              innerRef={register()}
              invalid={errors.lastName && true}
              disabled={!isEditable}
              onKeyDown={e => {
                if (e.key === KeyBoardEnum.Tab) {
                  e.preventDefault()
                  toggleTab('information')
                }
              }}
            />
            {errors && errors.lastName && <FormError>{errors.lastName.message}</FormError>}
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='email'>
              <FormattedMessage id='label.email' defaultMessage='Email' />
            </Label>
            <Input type='email' id='email' name='email' innerRef={register()} disabled />
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label for='role'>
              <FormattedMessage id='label.role' defaultMessage='Role' />
            </Label>
            <Select
              name='roleId'
              control={control}
              isDisabled={!isEditable || isOwner}
              isOptionDisabled={option => option.condition === RoleTypeEnum.Owner}
              options={arrayToSelectOptions(roles, 'roleName', 'roleId', 'roleTypeId')}
              isClearable={false}
            />
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  )
}

export default GeneralTabContent
