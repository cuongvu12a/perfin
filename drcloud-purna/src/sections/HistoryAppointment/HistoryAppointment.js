import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { getErrorMessage } from '@api/handleApiError'
import { getAppointmentHistoryByPatientIdAPI, getExaminationHistoryByPatientIdAPI } from '@api/main'
import HistoryRecord from '@components/HistoryRecord'
import Toast from '@utility/toast'
import ResultSheetModal from '@sections/ResultSheetModal'
import useInfiniteScrolling from '@hooks/useInfiniteScrolling'

const HistoryAppointment = ({ isMedicalRecordMode, clinicPatientId, handleError403, xScreenId }) => {
  const [resultSheet, setResultSheet] = useState(null)

  const handleOpenResultSheet = appointment => {
    setResultSheet(appointment)
  }

  const queryFunc = ({ pageNumber }) => {
    if (isMedicalRecordMode) {
      return getExaminationHistoryByPatientIdAPI({ clinicPatientId, pageNumber }, xScreenId)
    } else {
      return getAppointmentHistoryByPatientIdAPI({ clinicPatientId, pageNumber }, xScreenId)
    }
  }

  const dependency = [clinicPatientId, xScreenId]

  const handleError = error => {
    if (error.httpStatusCode === 403) {
      handleError403(error.config.url)
    } else {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  const {
    data: history,
    isLoading,
    isError,
    lastElementRef
  } = useInfiniteScrolling({ queryFunc, handleError, dependency })

  return (
    <>
      {!isLoading && !isError && history?.length !== 0 ? (
        <>
          <div>
            {history?.map((c, index) => (
              <div key={c.appointmentId} ref={index === history.length - 1 ? lastElementRef : null}>
                <HistoryRecord
                  isMedicalRecordMode={isMedicalRecordMode}
                  record={c}
                  handleOpenResultSheet={handleOpenResultSheet}
                />
              </div>
            ))}
          </div>
          {isMedicalRecordMode && (
            <ResultSheetModal appointment={resultSheet} handleOpenResultSheet={handleOpenResultSheet} />
          )}
        </>
      ) : (
        <FormattedMessage id='label.noData' defaultMessage='No Data' />
      )}
    </>
  )
}

export default HistoryAppointment
