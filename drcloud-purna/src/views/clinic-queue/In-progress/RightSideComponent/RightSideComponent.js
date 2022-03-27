import React, { Fragment, useRef, useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import { FileText } from 'react-feather'
import { CgPill } from 'react-icons/cg'

import Wizard from '@components/Wizard'

import ExaminationResult from './steps/ExaminationResult'
import Prescription from './steps/Prescription'
import ResultReview from './steps/ResultReview'

const RightSideComponent = ({
  appointmentDetail,
  resultReviewData,
  handleError403,
  setExaminationResultData,
  setPrescriptionData,
  handleFinish,
  setNextAppointment,
  handleStepFinal
}) => {
  const [step, setStep] = useState(null)
  const stepRef = useRef(null)

  const steps = [
    {
      id: 'examinationResult',
      icon: <FileText size={16} />,
      title: 'examinationResult',
      subtitle: 'examinationResult',
      content: (
        <ExaminationResult
          step={step}
          handleError403={handleError403}
          setExaminationResultData={setExaminationResultData}
          appointmentDetail={appointmentDetail}
        />
      )
    },
    {
      id: 'prescription',
      icon: <CgPill size={16} />,
      title: 'prescription',
      subtitle: 'prescription',
      content: (
        <Prescription
          step={step}
          handleError403={handleError403}
          setPrescriptionData={setPrescriptionData}
          handleStepFinal={handleStepFinal}
        />
      )
    },
    {
      id: 'resultReview',
      icon: <FileText size={16} />,
      title: 'resultReview',
      subtitle: 'resultReview',
      content: (
        <ResultReview
          step={step}
          resultReviewData={resultReviewData}
          handleFinish={handleFinish}
          setNextAppointment={setNextAppointment}
          appointmentDetail={appointmentDetail}
        />
      )
    }
  ]

  return (
    <Fragment>
      <div className='horizontal-wizard right-side-wrapper mb-0'>
        <Wizard instance={el => setStep(el)} ref={stepRef} steps={steps} />
      </div>
    </Fragment>
  )
}

export default RightSideComponent
