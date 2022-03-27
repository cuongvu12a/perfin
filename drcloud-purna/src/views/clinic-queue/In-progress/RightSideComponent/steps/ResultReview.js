import React, { Fragment, useRef, useState } from 'react'
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import { ArrowLeft, Check, Printer } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import { useReactToPrint } from 'react-to-print'

import PrintComponent from '@components/PrintComponent'
import ResultContent from '@components/ResultContent'

const ResultReview = ({ step, resultReviewData, handleFinish, setNextAppointment, appointmentDetail }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggle = () => setIsDropdownOpen(!isDropdownOpen)

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  return (
    <Fragment>
      <div className='right-side-content'>
        {!!resultReviewData && (
          <>
            <div className='right-side-body'>
              <ResultContent resultReviewData={resultReviewData} />
            </div>
            <div style={{ display: 'none' }}>
              <PrintComponent
                data={{
                  ...resultReviewData,
                  ...appointmentDetail.doctor,
                  ...appointmentDetail.patient,
                  clinicName: appointmentDetail.clinicName
                }}
                id={!!resultReviewData.printTemplateId ? resultReviewData.printTemplateId : 1}
                ref={componentRef}
              />
            </div>
          </>
        )}
      </div>
      <div className='right-side-footer'>
        <Button
          color='primary'
          onClick={() => {
            step.previous()
            setNextAppointment()
          }}
          outline
        >
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <FormattedMessage id='button.previous' defaultMessage='Previous' />
        </Button>
        <div className='d-flex'>
          <Button color='primary' outline onClick={handlePrint}>
            <Printer size={16} className='align-middle mr-sm-25 mr-0' />
            <FormattedMessage id='button.print' defaultMessage='Print' />
          </Button>

          <ButtonDropdown isOpen={isDropdownOpen} toggle={toggle}>
            <Button id='caret' className='ml-1' type='submit' color='success' onClick={() => handleFinish('CONTINUE')}>
              <FormattedMessage id='button.finish' defaultMessage='Finish' />
              <Check size={14} className='align-middle ml-sm-25 ml-0'></Check>
            </Button>
            <DropdownToggle split color='success' />
            <DropdownMenu right>
              <DropdownItem onClick={() => handleFinish('BACK')}>
                <FormattedMessage id='button.finishAndBack' defaultMessage='Finish `&` Back to Queue' />
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      </div>
    </Fragment>
  )
}

export default ResultReview
