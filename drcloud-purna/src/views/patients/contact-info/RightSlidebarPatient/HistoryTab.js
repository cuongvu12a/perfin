import { FrontEndScreenEnum } from '@utility/constants'
import HistoryAppointment from '@sections/HistoryAppointment'

const xScreenId = FrontEndScreenEnum.Contacts

const HistoryTab = ({ patientDetail, handleError403 }) => {
  return (
    <HistoryAppointment
      isMedicalRecordMode={false}
      handleError403={handleError403}
      clinicPatientId={patientDetail.clinicPatientId}
      xScreenId={xScreenId}
    />
  )
}

export default HistoryTab
