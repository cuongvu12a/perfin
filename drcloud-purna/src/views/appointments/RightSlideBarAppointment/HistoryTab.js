import { FrontEndScreenEnum } from '@utility/constants'
import HistoryAppointment from '@sections/HistoryAppointment'

const xScreenId = FrontEndScreenEnum.Appointments

const HistoryTab = ({ appointmentDetail, handleError403 }) => {
  return (
    <HistoryAppointment
      isMedicalRecordMode={false}
      handleError403={handleError403}
      clinicPatientId={appointmentDetail.patient.clinicPatientId}
      xScreenId={xScreenId}
    />
  )
}

export default HistoryTab
