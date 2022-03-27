import { Label } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { format, parseISO } from 'date-fns'
import { reverseEnumObject } from '@utility/utils'
import { GenderEnum, CountryEnum } from '@utility/constants'

const PatientInfoTab = ({ patientDetail }) => {
  return (
    <>
      <div>
        <div className='mb-1'>
          <Label for='patientFullName' className='text-secondary'>
            <FormattedMessage id='label.patientName' defaultMessage='Patient name' />
          </Label>
          <h4>{patientDetail.fullName}</h4>
        </div>
        <div className='mb-1'>
          <Label for='patientCode' className='text-secondary'>
            <FormattedMessage id='label.patientCode' defaultMessage='Patient Code' />
          </Label>
          <h4>{patientDetail.clinicPatientCode}</h4>
        </div>
        <div className='mb-1'>
          <Label for='birthday' className='text-secondary'>
            <FormattedMessage id='label.birthday' defaultMessage='Birthday' />
          </Label>
          <h4>{format(patientDetail.birthdayUnix, 'dd/MM/yyyy')}</h4>
        </div>

        <div className='mb-1'>
          <Label for='gender' className='text-secondary'>
            <FormattedMessage id='label.gender' defaultMessage='Gender' />
          </Label>
          <h4>
            <FormattedMessage
              id={`enum.${reverseEnumObject(GenderEnum)[patientDetail.gender]}`}
              defaultMessage='Male'
            />
          </h4>
        </div>
        <div className='mb-1'>
          <Label for='nationality' className='text-secondary'>
            <FormattedMessage id='label.nationality' defaultMessage='Nationality' />
          </Label>
          <h4>
            <FormattedMessage
              id={`enum.${reverseEnumObject(CountryEnum)[patientDetail.countryId]}`}
              defaultMessage='Nationality'
            />
          </h4>
        </div>

        <div className='mb-1'>
          <Label for='phoneNumber' className='text-secondary'>
            <FormattedMessage id='label.phoneNumber' defaultMessage='Phone Number' />
          </Label>
          <h4>{patientDetail.phoneNumber}</h4>
        </div>
        <div className='mb-1'>
          <Label for='email' className='text-secondary'>
            <FormattedMessage id='label.email' defaultMessage='Email' />
          </Label>
          <h4>{patientDetail.email}</h4>
        </div>
        <div className='mb-1'>
          <Label for='address' className='text-secondary'>
            <FormattedMessage id='label.address' defaultMessage='Address' />
          </Label>
          <h4>{patientDetail.address}</h4>
        </div>
        <div className='mb-1'>
          <Label for='height' className='text-secondary'>
            <FormattedMessage id='label.height' defaultMessage='Height' />
          </Label>
          <h4> {`${patientDetail.heightInCm} cm`} </h4>
        </div>
        <div className='mb-1'>
          <Label for='weight' className='text-secondary'>
            <FormattedMessage id='label.weight' defaultMessage='Weight' />
          </Label>
          <h4> {`${patientDetail.weightInKg} Kg`} </h4>
        </div>
        {patientDetail.medicalHistory && (
          <div className='mb-1'>
            <Label for='medicalHistory' className='text-secondary'>
              <FormattedMessage id='label.medicalHistory' defaultMessage='Medical History' />
            </Label>
            <h4> {patientDetail.medicalHistory} </h4>
          </div>
        )}
        {patientDetail.allergy && (
          <div className='mb-1'>
            <Label for='allergy' className='text-secondary'>
              <FormattedMessage id='label.allergy' defaultMessage='Allergy' />
            </Label>
            <h4> {patientDetail.allergy} </h4>
          </div>
        )}
      </div>
    </>
  )
}

export default PatientInfoTab
