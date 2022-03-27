import { Badge, Button, Label } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { AppointmentStatusDisplayConfig } from '@utility/constants'
import { format, startOfDay } from 'date-fns'

const OverviewTab = ({ appointmentDetail, allowApprove, allowCheckIn, onActionClick }) => {
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mt-50 mb-1'>
        <Badge
          className='badge-status-appointment'
          color={AppointmentStatusDisplayConfig[appointmentDetail.appointmentStatusId]?.color}
          pill
        >
          <FormattedMessage
            id={`enum.${AppointmentStatusDisplayConfig[appointmentDetail.appointmentStatusId]?.title}`}
            defaultMessage={`${AppointmentStatusDisplayConfig[appointmentDetail.appointmentStatusId]?.title}`}
          />
        </Badge>
        {allowApprove && (
          <Button
            color='primary'
            onClick={() => onActionClick('approve')}
            disabled={appointmentDetail.startDatetimeUnix < startOfDay(new Date()).valueOf()}
          >
            <FormattedMessage id={`button.approve`} defaultMessage='Approve' />
          </Button>
        )}
        {allowCheckIn && (
          <Button
            color='primary'
            onClick={() => onActionClick('checkin')}
            disabled={appointmentDetail.startDatetimeUnix < startOfDay(new Date()).valueOf()}
          >
            <FormattedMessage id={`button.checkIn`} defaultMessage='Check In' />
          </Button>
        )}
      </div>
      <div className='mb-1'>
        <Label for='date' className='text-secondary'>
          <FormattedMessage id='label.appointmentCode' defaultMessage='Appointment Code' />
        </Label>
        <h4>{appointmentDetail.appointmentCode}</h4>
      </div>
      <div className='mb-1'>
        <Label for='clinicName' className='text-secondary'>
          <FormattedMessage id='label.location' defaultMessage='Location' />
        </Label>
        <h4>{appointmentDetail.locationName}</h4>
      </div>
      <div className='mb-1'>
        <Label for='date' className='text-secondary'>
          <FormattedMessage id='label.appointmentDate' defaultMessage='Date' />
        </Label>
        <h4>{format(appointmentDetail.startDatetimeUnix, 'dd/MM/yyyy')}</h4>
      </div>
      <div className='mb-1'>
        <Label for='hour' className='text-secondary'>
          <FormattedMessage id='label.appointmentTime' defaultMessage='Time' />
        </Label>
        <h4>{format(appointmentDetail.startDatetimeUnix, 'HH:mm')}</h4>
      </div>
      <div className='mb-1'>
        <Label for='doctorName' className='text-secondary'>
          <FormattedMessage id='label.doctorName' defaultMessage='Doctor Name' />
        </Label>
        <h4>{appointmentDetail.doctor.doctorName}</h4>
      </div>
      <div className='mb-1'>
        <Label for='symptom' className='text-secondary'>
          <FormattedMessage id='label.symptom' defaultMessage='symptom' />
        </Label>
        <h4>{appointmentDetail.symptom || <FormattedMessage id='label.none' defaultMessage='None' />}</h4>
      </div>
      {appointmentDetail.cancelReason && (
        <div className='mb-1'>
          <Label for='cancellationReason' className='text-secondary'>
            <FormattedMessage id='label.cancellationReason' defaultMessage='Cancellation Reason' />
          </Label>
          <h4>{appointmentDetail.cancelReason}</h4>
        </div>
      )}
      <div className='mb-1'>
        <Label for='updatedDateTimeUnix' className='text-secondary'>
          <FormattedMessage id='label.updatedAt' defaultMessage='Updated at' />
        </Label>
        <h4>{format(appointmentDetail.updatedDateTimeUnix, 'dd/MM/yyyy HH:mm:ss')}</h4>
      </div>
    </div>
  )
}

export default OverviewTab
