import React, { Fragment, useState } from 'react'
import { Card, ModalBody, TabContent, TabPane } from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import classnames from 'classnames'

import ScrollNav from '@components/ScrollNav'
import { reverseEnumObject } from '@utility/utils'
import HistoryTab from './HistoryTab'
import PatientInfoTab from './PatientInfoTab'
import { GenderEnum } from '@utility/constants'
import AvatarWrapper from '@components/AvatarWrapper'

const SidebarLeft = ({ appointmentDetail, nextAppointment, handleError403 }) => {
  const intl = useIntl()
  const [activeTab, setActiveTab] = useState('0')
  const navItems = [{ name: 'patientInfo' }, { name: 'examinationHistory' }]

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <Fragment>
      <div className='lefSide-component'>
        <Card className={classnames('next-patient', { show: !!nextAppointment })}>
          <div className='h-100 px-2 pt-1 pb-0 position-relative'>
            <div className='d-flex align-items-center ml-0 mb-50'>
              <h6 className='text-white mb-0 mr-auto '>
                <FormattedMessage id='label.nextPatient' defaultMessage='Next Patient' />
              </h6>
            </div>

            {nextAppointment && (
              <AvatarWrapper
                imgUrl={nextAppointment.patient.avatar?.fileUrl}
                title={nextAppointment.patient.fullName}
                subTitle={`${intl.formatMessage({
                  id: `enum.${reverseEnumObject(GenderEnum)[nextAppointment.patient.gender || GenderEnum.Male]}`
                })} - ${new Date(nextAppointment.patient.birthdayUnix).getFullYear()}`}
                size='lg'
                titleColor='white'
                subTitleColor='white'
              />
            )}
          </div>
        </Card>
        <div className='current-patient'>
          <div className='lefSide-component-header px-2 pt-1 pb-0 position-relative'>
            <div className='d-flex align-items-center ml-0 mb-50'>
              <h6 className='text-secondary mb-0 mr-auto '>
                <FormattedMessage id='label.currentPatient' defaultMessage='Current Patient' />
              </h6>
            </div>

            {appointmentDetail && (
              <AvatarWrapper
                imgUrl={appointmentDetail.patient.avatar?.fileUrl}
                title={appointmentDetail.patient.fullName}
                subTitle={`${intl.formatMessage({
                  id: `enum.${reverseEnumObject(GenderEnum)[appointmentDetail.patient.gender] || 0}`
                })} - ${new Date(appointmentDetail.patient.birthdayUnix).getFullYear()}`}
                size='lg'
              />
            )}
            <ScrollNav activeTab={activeTab} toggleTab={toggleTab} navItems={navItems} />
            <hr className='my-0' />
          </div>
          <ModalBody className={classnames({ 'has-next-patient': !!nextAppointment })}>
            {appointmentDetail && (
              <TabContent className='py-50' activeTab={activeTab}>
                <TabPane tabId='0'>
                  <PatientInfoTab patient={appointmentDetail.patient} />
                </TabPane>
                <TabPane tabId='1'>
                  <HistoryTab appointmentDetail={appointmentDetail} handleError403={handleError403} />
                </TabPane>
              </TabContent>
            )}
          </ModalBody>
        </div>
      </div>
    </Fragment>
  )
}

export default SidebarLeft
