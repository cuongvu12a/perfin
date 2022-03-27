import React from 'react'
import { FormattedMessage } from 'react-intl'

const PrintComponent = React.forwardRef(({ id, data }, ref) => {
  const Template = React.lazy(() =>
    import(`./PrintTemplate/Template${id}`).catch(() => {
      return {
        default: () => (
          <>
            <style>
              {`
              @page {
                size: auto;
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
            `}
            </style>
            <div>
              <FormattedMessage id='print.templateNotFound' defaultMessage='Print template not found' />
            </div>
          </>
        )
      }
    })
  )

  return (
    <div ref={ref}>
      <Template resultData={data} />
    </div>
  )
})

export default PrintComponent
