// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Edit, X } from 'react-feather'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import Toast from '@utility/toast'
import ScrollNav from '@components/ScrollNav'
import { getErrorMessage } from '@api/handleApiError'
import { getMedicalRecordAPI } from '@api/main'
import { reverseEnumObject } from '@utility/utils'
import { FrontEndScreenEnum, GenderEnum, KeyBoardEnum } from '@utility/constants'
import useKeypress from '@hooks/useKeyPress'
import PatientInfoTab from './PatientInfo'
import HistoryTab from './HistoryTab'
import { Can } from '@utility/context/Can'
import AvatarWrapper from '@components/AvatarWrapper'

const xScreenId = FrontEndScreenEnum.MedicalRecords

const RightSlidebarPatient = ({ open, toggle, handleError403, clinicPatientId, openEditModal, refresh }) => {
  const intl = useIntl()
  const [activeTab, setActiveTab] = useState('0')
  const [patientDetail, setPatientDetail] = useState()
  const navItems = [{ name: 'patientInfo' }, { name: 'appointmentHistory' }]

  useKeypress(KeyBoardEnum.Escape, () => {
    toggle()
  })

  useEffect(async () => {
    if (clinicPatientId) {
      try {
        const patientDetailRes = await getMedicalRecordAPI(clinicPatientId, xScreenId)
        setPatientDetail(patientDetailRes.data)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        } else {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      }
    }
  }, [clinicPatientId, refresh])

  useEffect(() => {
    if (open) {
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.querySelector('body').style.overflow = 'auto'
    }
  }, [open])

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <div
      className={classnames('right-slidebar', {
        show: open
      })}
    >
      <div className='right-slidebar-content'>
        <div className='right-slidebar-header px-2 pt-1 pb-0 position-relative'>
          <div className='d-flex align-items-center ml-0 mb-50'>
            <h6 className='text-secondary mb-0 mr-auto '>
              <FormattedMessage id='label.patient' defaultMessage='Patient' />
            </h6>
            <Can I='write' a='medicalRecords'>
              <UncontrolledButtonDropdown className='slide-bar-header-btn' size='sm'>
                <DropdownToggle outline color='primary' caret className='bg-white'>
                  <FormattedMessage id='button.actions' defaultMessage='Actions' />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem tag='a' onClick={openEditModal}>
                    <Edit className='mr-50' size={15} />
                    <span className='align-middle'>
                      <FormattedMessage id='button.edit' defaultMessage='Edit' />
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </Can>

            <X className='cursor-pointer' size={25} onClick={toggle} />
          </div>

          {patientDetail && (
            <AvatarWrapper
              imgUrl={patientDetail.avatar?.fileUrl}
              title={patientDetail.fullName}
              subTitle={`${intl.formatMessage({
                id: `enum.${reverseEnumObject(GenderEnum)[patientDetail.gender || GenderEnum.Male]}`
              })} - ${new Date(patientDetail.birthdayUnix).getFullYear()}`}
              size='lg'
            />
          )}

          <ScrollNav activeTab={activeTab} toggleTab={toggleTab} navItems={navItems} />
          <hr className='my-0' />
        </div>
        <ModalBody>
          {patientDetail && (
            <TabContent className='py-50' activeTab={activeTab}>
              <TabPane tabId='0'>
                <PatientInfoTab patientDetail={patientDetail} />
              </TabPane>
              <TabPane tabId='1'>
                <HistoryTab patientDetail={patientDetail} handleError403={handleError403} />
              </TabPane>
            </TabContent>
          )}
        </ModalBody>
      </div>
    </div>
  )
}

export default RightSlidebarPatient
