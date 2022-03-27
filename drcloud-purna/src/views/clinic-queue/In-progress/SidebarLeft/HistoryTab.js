import { FrontEndScreenEnum } from '@utility/constants'
import HistoryAppointment from '@sections/HistoryAppointment'

const xScreenId = FrontEndScreenEnum.TodayExaminations

const HistoryTab = ({ appointmentDetail, handleError403 }) => {
  return (
    <HistoryAppointment
      isMedicalRecordMode={true}
      handleError403={handleError403}
      clinicPatientId={appointmentDetail.patient.clinicPatientId}
      xScreenId={xScreenId}
    />
  )
}

export default HistoryTab
