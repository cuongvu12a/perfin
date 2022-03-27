import React, { useEffect, useState } from 'react'
import { CardBody } from 'reactstrap'
import { format } from 'date-fns'
import { FormattedMessage, useIntl } from 'react-intl'

import CardActions from '@core/components/card-actions'
import { PropertyValueTypeEnum, MedicineUnitTypeEnum } from '@utility/constants'
import { reverseEnumObject } from '@utility/utils'

export default function ResultContent({ resultReviewData }) {
  const intl = useIntl()
  const [propertyDetailsResult, setPropertyDetailsResult] = useState()

  useEffect(() => {
    const propDetailData = (resultReviewData?.propertyList || resultReviewData?.properties)?.map(prop => {
      return {
        propertyName: prop.propertyName,
        propertyValue: resultReviewData.properties[prop.propertyId],
        propertyValueTypeId: prop.propertyValueTypeId
      }
    })
    setPropertyDetailsResult(propDetailData)
  }, [resultReviewData])

  return (
    <>
      <CardActions title={intl.formatMessage({ id: 'label.symptom' })} actions='collapse'>
        <CardBody className='pt-0'>
          <h6>{resultReviewData.symptom}</h6>
        </CardBody>
      </CardActions>
      <CardActions
        title={`${intl.formatMessage({ id: 'label.examinationDetails' })}: ${resultReviewData.formName || ''}`}
        actions='collapse'
      >
        {propertyDetailsResult?.map(c => (
          <CardBody key={c.propertyName}>
            <h6 className='font-weight-bolder text-uppercase mb-0'>{`${c.propertyName}:`}</h6>
            {c.propertyValueTypeId === PropertyValueTypeEnum.Date ? (
              <h6 className='ml-50'>{!!c.propertyValue && format(c.propertyValue, 'dd/MM/yyyy')}</h6>
            ) : (
              <>
                {c.propertyValueTypeId === PropertyValueTypeEnum.DateTime ? (
                  <h6 className='ml-50'>{!!c.propertyValue && format(c.propertyValue, 'dd/MM/yyyy HH:mm')}</h6>
                ) : (
                  <h6 className='ml-50'>{c.propertyValue}</h6>
                )}
              </>
            )}
          </CardBody>
        ))}
      </CardActions>
      <CardActions title={intl.formatMessage({ id: 'label.result' })} actions='collapse'>
        <CardBody>
          <h6>{resultReviewData.result}</h6>
        </CardBody>
        {!!resultReviewData.reExaminationDate && (
          <CardBody>
            <h6 className='font-weight-bolder text-uppercase mb-0'>
              <FormattedMessage id='label.reexaminationDate' defaultMessage='ReExamination Date:' />
              {':'}
            </h6>
            <h6 className='ml-50'>{format(resultReviewData.reExaminationDate, 'dd/MM/yyyy')}</h6>
          </CardBody>
        )}
      </CardActions>
      {(resultReviewData?.medicines?.length > 0 || resultReviewData.note) && (
        <CardActions title={intl.formatMessage({ id: 'label.prescription' })} actions='collapse'>
          <CardBody>
            <div className='d-flex flex-column'>
              {resultReviewData.medicines.map((c, index) => (
                <h6 key={index}>{`${index + 1}. ${c.medicine?.medicineName || c.medicineName}, ${
                  c.amount
                } ${intl.formatMessage({
                  id: `enum.${reverseEnumObject(MedicineUnitTypeEnum)[c.unitTypeEnum || c.medicineUnitTypeId]}`
                })}, ${c.usage || c.guide}`}</h6>
              ))}
            </div>
          </CardBody>
          {resultReviewData.note && (
            <CardBody>
              <h6 className='font-weight-bolder text-uppercase mb-0'>
                <FormattedMessage id='label.note1' defaultMessage='Note' />
                {':'}
              </h6>
              <h6 className='ml-50'>{resultReviewData.note}</h6>
            </CardBody>
          )}
        </CardActions>
      )}
    </>
  )
}
