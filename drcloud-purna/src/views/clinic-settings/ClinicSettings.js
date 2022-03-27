import { Fragment, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col, TabContent, TabPane } from 'reactstrap'
import { useParams } from 'react-router-dom'

import Tabs from './Tabs'
import General from './General'
import Locations from './Locations'
import Specialty from './Specicalty'
import Doctors from './Doctors'
import SymptomsSuggest from './SymptomsSuggest'
import UserAccounts from './UserAccounts'
import Roles from './Roles'
import Groups from './Groups'
import Properties from './Properties'
import Forms from './Forms'
import Medicines from './Medicines'

import '@core/scss/react/pages/page-account-settings.scss'

const ClinicSettings = () => {
  const [activeTab, setActiveTab] = useState('1')
  const { tab } = useParams()

  useEffect(() => {
    setActiveTab(tab || 'general')
  }, [tab])

  return (
    <Fragment>
      <div className='content-header row mb-2 pl-1'>
        <h2 className='content-header-title float-left mb-0'>
          <FormattedMessage id='title.clinicSettings' defaultMessage='Clinic Settings' />
        </h2>
      </div>
      <Row>
        <Col className='mb-2 mb-md-0' md='3'>
          <Tabs activeTab={activeTab} />
        </Col>
        <Col md='9'>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='general'>{activeTab === 'general' && <General />}</TabPane>
            <TabPane tabId='locations'>{activeTab === 'locations' && <Locations />}</TabPane>
            <TabPane tabId='specialties'>{activeTab === 'specialties' && <Specialty />}</TabPane>
            <TabPane tabId='doctors'>{activeTab === 'doctors' && <Doctors />}</TabPane>
            <TabPane tabId='symptoms'>{activeTab === 'symptoms' && <SymptomsSuggest />}</TabPane>
            <TabPane tabId='users'>{activeTab === 'users' && <UserAccounts />}</TabPane>
            <TabPane tabId='roles'>{activeTab === 'roles' && <Roles />}</TabPane>
            <TabPane tabId='groups'>{activeTab === 'groups' && <Groups />}</TabPane>
            <TabPane tabId='properties'>{activeTab === 'properties' && <Properties />}</TabPane>
            <TabPane tabId='forms'>{activeTab === 'forms' && <Forms />}</TabPane>
            <TabPane tabId='medicines'>{activeTab === 'medicines' && <Medicines />}</TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ClinicSettings
