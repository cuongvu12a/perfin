import { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, Card } from 'reactstrap'

const PermissionAlertCard = ({ title, apiRoute, isShowTitle }) => (
  <Fragment>
    {isShowTitle && (
      <div className='content-header row mb-2 pl-1'>
        <h2 className='content-header-title float-left mb-0'>
          <FormattedMessage id={`title.${title}`} defaultMessage={`title.${title}`} />
        </h2>
      </div>
    )}
    <Card>
      <Alert className='mt-2 mx-2' color='warning'>
        <div className='alert-body'>
          <span>
            {apiRoute ? (
              <FormattedMessage
                id='alert.apiError403'
                values={{ apiRoute }}
                defaultMessage='You do not have access to this section! ({apiRoute})'
              />
            ) : (
              <FormattedMessage id='alert.notPermission' defaultMessage='You do not have access to this section!' />
            )}
          </span>
        </div>
      </Alert>
    </Card>
  </Fragment>
)

export default PermissionAlertCard
