import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Label } from 'reactstrap'
import { format } from 'date-fns'

import { GenderEnum } from '@utility/constants'
import { reverseEnumObject } from '@utility/utils'

const PatientInfoTab = ({ patient }) => {
  return (
    <>
      <div>
        <div className='mb-1'>
          <Label for='patientFullName' className='text-secondary'>
            <FormattedMessage id='label.patientName' defaultMessage='patient name' />
          </Label>
          <h4>{patient.fullName}</h4>
        </div>
        <div className='mb-1'>
          <Label for='birthday' className='text-secondary'>
            <FormattedMessage id='label.birthday' defaultMessage='Birthday' />
          </Label>
          <h4>{format(patient.birthdayUnix, 'dd/MM/yyyy')}</h4>
        </div>

        <div className='mb-1'>
          <Label for='gender' className='text-secondary'>
            <FormattedMessage id='label.gender' defaultMessage='Gender' />
          </Label>
          <h4>
            <FormattedMessage id={`enum.${reverseEnumObject(GenderEnum)[patient.gender]}`} defaultMessage='Male' />
          </h4>
        </div>
        <div className='mb-1'>
          <Label for='height' className='text-secondary'>
            <FormattedMessage id='label.height' defaultMessage='Height' />
          </Label>
          <h4> {`${patient.heightInCm} cm`} </h4>
        </div>
        <div className='mb-1'>
          <Label for='weight' className='text-secondary'>
            <FormattedMessage id='label.weight' defaultMessage='Weight' />
          </Label>
          <h4> {`${patient.weightInKg} Kg`} </h4>
        </div>
        {patient.medicalHistory && (
          <div className='mb-1'>
            <Label for='medicalHistory' className='text-secondary'>
              <FormattedMessage id='label.medicalHistory' defaultMessage='Medical History' />
            </Label>
            <h4> {patient.medicalHistory} </h4>
          </div>
        )}
        {patient.allergy && (
          <div className='mb-1'>
            <Label for='allergy' className='text-secondary'>
              <FormattedMessage id='label.allergy' defaultMessage='Allergy' />
            </Label>
            <h4> {patient.allergy} </h4>
          </div>
        )}
      </div>
    </>
  )
}

export default PatientInfoTab
