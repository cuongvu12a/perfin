import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  TabContent,
  TabPane
} from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Switch from '@components/Switch'
import { EntityTypeEnum, FrontEndScreenEnum, PrintTemplateList } from '@utility/constants'
import { arrayToSelectOptions } from '@utility/utils'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import { getFormByIdAPI, createFormAPI, updateFormAPI, getPrintTemplatesAPI } from '@api/main'

import PropertiesTab from './PropertiesTab'
import SettingsTab from './SettingsTab'
import Tabs from './Tabs'

const xScreenId = FrontEndScreenEnum.Forms

const EditFormsModal = ({ open, close, form, handleError403, isEditable }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [propertyList, setPropertyList] = useState([]) // list of properties
  const [updateDefaultPropList, setUpdateDefaultPropList] = useState([]) // list of default properties when updating forms
  const [printTemplateList, setPrintTemplateList] = useState([])

  const EditFormSchema = yup.object().shape({
    formName: yup.string().max(128).required().trim()
  })

  const defaultValues = {
    entityTypeId: EntityTypeEnum.ResultSheet,
    formName: '',
    printTemplateId: 1
  }

  const { handleSubmit, formState, control, errors, reset, watch, register, trigger } = useForm({
    mode: 'onChange',
    resolver: yupResolver(EditFormSchema),
    defaultValues
  })

  const entityTypeId = watch('entityTypeId')

  useEffect(async () => {
    try {
      if (form?.formId) {
        const res = await getFormByIdAPI(form.formId, xScreenId)
        reset({
          ...defaultValues,
          ...{
            entityTypeId: res.data.entityTypeId,
            formName: res.data.formName,
            isEnabled: res.data.isEnabled,
            printTemplateId: res.data.printTemplateId
          }
        })
        setUpdateDefaultPropList(res.data.properties)
        setPropertyList(res.data.properties)
      }

      const printRes = await getPrintTemplatesAPI(xScreenId)
      const totalTemplateList = PrintTemplateList.filter(
        p => printRes.data.printTemplateIds.includes(p.templateId) || !!p.isDefault
      )
      setPrintTemplateList(totalTemplateList)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [])

  useEffect(() => {
    setPropertyList([])
  }, [entityTypeId])

  const isPropertyListChange = useMemo(() => {
    trigger()
    return (
      propertyList.map(id => id.propertyId).toString() !== updateDefaultPropList.map(id => id.propertyId).toString()
    )
  }, [JSON.stringify(propertyList)])

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const onSubmit = async data => {
    const newData = {
      ...data,
      propertyIds: propertyList.map(id => id.propertyId)
    }

    try {
      if (form?.formId) {
        delete newData.entityTypeId

        await updateFormAPI(form.formId, newData, xScreenId)
      } else {
        await createFormAPI(newData, xScreenId)
      }

      Toast.showSuccess('toast.success')
      close('SAVED')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={open}
        toggle={close}
        autoFocus={false}
        backdrop='static'
        className='modal-dialog-centered modal-md'
        key='EditUserGroupsModal'
        id='edit-user-groups-modal'
      >
        <Form className='clinic-settings'>
          <ModalHeader tag='div' cssModule={{ 'modal-title': 'w-100 d-flex flex-row justify-content-between' }}>
            {form ? (
              <>
                <h2>
                  <FormattedMessage id='title.editingForm' defaultMessage='Editing Form' />
                </h2>
                <Switch
                  activeLabel={<FormattedMessage id='label.enable' defaultMessage='Enable' />}
                  deactiveLabel={<FormattedMessage id='label.disable' defaultMessage='Disable' />}
                  name='isEnabled'
                  control={control}
                  disabled={!isEditable}
                />
              </>
            ) : (
              <h2>
                <FormattedMessage id='title.addingForm' defaultMessage='Adding Form' />
              </h2>
            )}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-2 mb-md-0' md='3'>
                <Tabs activeTab={activeTab} toggleTab={toggleTab} />
              </Col>
              <Col md='9'>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId='general'>
                        <SettingsTab
                          toggleTab={toggleTab}
                          control={control}
                          register={register}
                          errors={errors}
                          isEditable={isEditable}
                          form={form}
                          printTemplateList={printTemplateList}
                        />
                      </TabPane>
                      <TabPane tabId='properties'>
                        <PropertiesTab
                          isEditable={isEditable}
                          entityTypeId={entityTypeId}
                          propertyList={propertyList}
                          setPropertyList={setPropertyList}
                        />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {((!formState.isDirty && !isPropertyListChange) || !isEditable) && (
              <Button color='secondary' outline onClick={() => close()}>
                <FormattedMessage id='button.close' defaultMessage='Close' />
              </Button>
            )}
            {(formState.isDirty || isPropertyListChange) && isEditable && (
              <>
                <Button color='secondary' outline onClick={() => close()}>
                  <FormattedMessage id='button.cancel' defaultMessage='Cancel' />
                </Button>

                <Button
                  color='primary'
                  type='submit'
                  disabled={
                    form
                      ? !(formState.isValid || isPropertyListChange) ||
                        propertyList.length === 0 ||
                        formState.isSubmitting
                      : !(formState.isValid && isPropertyListChange && propertyList.length !== 0) ||
                        formState.isSubmitting
                  }
                  onClick={handleSubmit(onSubmit)}
                >
                  <FormattedMessage id='button.save' defaultMessage='Save' />
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default EditFormsModal
