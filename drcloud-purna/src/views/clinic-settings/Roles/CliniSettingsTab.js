import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { CustomInput, FormGroup, Label } from 'reactstrap'
import { Controller } from 'react-hook-form'
import { PermissionTypeEnum, PermissionScreens } from '@utility/constants'

const ClinicSettingsTab = ({ control, isEditable }) => {
  return (
    <Fragment>
      <h3 className='mb-1'>
        <FormattedMessage id='title.clinicSettings' defaultMessage='Clinic Settings' />
      </h3>

      <FormGroup>
        {PermissionScreens
          .filter(id => id.tab === 'settings')
          .map((s, index) => (
            <Controller
              name={`clinicSettingScreen[${index}]`}
              control={control}
              key={index}
              render={({ onChange, value }) => (
                <div>
                  <hr className='my-50' />

                  <div className='d-flex align-items-center justify-content-between'>
                    <FormattedMessage id={s.frontendScreenTitle} defaultMessage={s.frontendScreenTitle} />
                    <fieldset className='d-inline-flex text-center' id={s.frontendScreenId}>
                      <FormGroup className='mb-0 mr-2'>
                        <Label for='read'>
                          <FormattedMessage id='enum.Read' defaultMessage='Read' />
                        </Label>
                        <div className='pl-50'>
                          <CustomInput
                            type='radio'
                            id={`${s.frontendScreenId}.read`}
                            checked={
                              value.permissionTypeId === PermissionTypeEnum.Read &&
                              value.frontendScreenId === s.frontendScreenId
                            }
                            onChange={e => {
                              onChange({
                                frontendScreenId: s.frontendScreenId,
                                permissionTypeId: PermissionTypeEnum.Read,
                                isEditable: value.isEditable
                              })
                            }}
                            disabled={!isEditable || !value.isEditable}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup className='mb-0 mr-1'>
                        <Label for='write'>
                          <FormattedMessage id='enum.Write' defaultMessage='Write' />
                        </Label>
                        <div className='pl-50'>
                          <CustomInput
                            type='radio'
                            id={`${s.frontendScreenId}.write`}
                            checked={
                              value.permissionTypeId === PermissionTypeEnum.Write &&
                              value.frontendScreenId === s.frontendScreenId
                            }
                            onChange={e => {
                              onChange({
                                frontendScreenId: s.frontendScreenId,
                                permissionTypeId: PermissionTypeEnum.Write,
                                isEditable: value.isEditable
                              })
                            }}
                            disabled={!isEditable || !value.isEditable}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup className='mb-0'>
                        <Label for='denied'>
                          <FormattedMessage id='enum.Denied' defaultMessage='Denied' />
                        </Label>
                        <div className='clinic-roles-custom-radio-input'>
                          <CustomInput
                            type='radio'
                            id={`${s.frontendScreenId}.denied`}
                            checked={
                              value.permissionTypeId === PermissionTypeEnum.None &&
                              value.frontendScreenId === s.frontendScreenId
                            }
                            onChange={e => {
                              onChange({
                                frontendScreenId: s.frontendScreenId,
                                permissionTypeId: PermissionTypeEnum.None,
                                isEditable: value.isEditable
                              })
                            }}
                            disabled={!isEditable || !value.isEditable}
                          />
                        </div>
                      </FormGroup>
                    </fieldset>
                  </div>
                </div>
              )}
            />
          ))}
      </FormGroup>
    </Fragment>
  )
}

export default ClinicSettingsTab
