import { GenderEnum, PropertyValueTypeEnum } from '@utility/constants'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'

const Template1 = resultData => {
  const [propertyDetailsResult, setPropertyDetailsResult] = useState()

  useEffect(() => {
    const propDetailData = resultData?.resultData?.propertyList?.map(prop => {
      return {
        propertyName: prop.propertyName,
        propertyValue: resultData.resultData.properties[prop.propertyId],
        propertyValueTypeId: prop.propertyValueTypeId
      }
    })
    setPropertyDetailsResult(propDetailData)
  }, [resultData])

  return (
    <>
      <style type='text/css'>
        {`
        @page {
          size: auto;
          margin: 0.5cm 0.5cm 0.5cm 0.5cm; 
        }

        body {
          margin: 0;
          padding: 0;
        }

        @media print {
          html, body {
            height:100vh; 
            margin: 0 !important; 
            padding: 0 !important;
            overflow: hidden;
            font-family: "Times New Roman", Times, serif;
            color: black
          }
        }

        h2 {
          color: black;
          font-weight: bolder;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        p{
          margin: 0px;
          font-size: 16pt;
        }
      `}
      </style>
      {!!resultData.resultData && (
        <div>
          <h2>PHÒNG KHÁM {resultData.resultData.clinicName}</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h2>PHIẾU SIÊU ÂM</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className='d-flex'>
              <p>Họ và tên:&nbsp;</p>
              <p style={{ fontWeight: 'bold' }}>{resultData.resultData.fullName}</p>
            </div>
            <div className='d-flex'>
              <div style={{ marginRight: '100px' }} className='d-flex'>
                <p>Năm sinh:&nbsp;</p>
                <p>
                  {!!resultData.resultData.birthdayUnix && new Date(resultData.resultData.birthdayUnix).getFullYear()}
                </p>
              </div>
              <div style={{ display: 'flex' }}>
                <p>Giới Tính:&nbsp;</p>
                <p>{resultData?.resultData?.gender === GenderEnum.Male ? 'Nam' : 'Nữ'}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <p>Địa chỉ:&nbsp; {resultData.resultData.address}</p>
          </div>
          <div style={{ display: 'flex' }}>
            <p>Triệu Chứng:&nbsp; {resultData.resultData.symptom}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h2>KẾT QUẢ</h2>
          </div>

          <h2>PHẦN MÔ TẢ</h2>

          <div style={{ marginBottom: '10px' }}>
            {propertyDetailsResult?.map(c => (
              <div key={c.propertyName}>
                <p>
                  {`-${c.propertyName}: `}&nbsp;
                  {c.propertyValueTypeId === PropertyValueTypeEnum.Date ? (
                    <>{!!c.propertyValue && format(c.propertyValue, 'dd/MM/yyyy')}</>
                  ) : (
                    <>
                      {c.propertyValueTypeId === PropertyValueTypeEnum.DateTime ? (
                        <>{!!c.propertyValue && format(c.propertyValue, 'dd/MM/yyyy HH:mm')}</>
                      ) : (
                        <>{c.propertyValue}</>
                      )}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          <h2>KẾT LUẬN</h2>
          <p>{resultData.resultData.result}</p>

          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '50px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <p style={{ display: 'flex', justifyContent: 'center', fontStyle: 'italic' }}>
                {`Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
              </p>

              <h2>BÁC SĨ CHUYÊN KHOA</h2>

              <p style={{ marginTop: '100px' }}>BS: {resultData.resultData.doctorName} </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Template1
