import React, { useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import * as serviceWorker from './serviceWorker'

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = React.useState(false)
  const [waitingWorker, setWaitingWorker] = React.useState(null)

  const onSWUpdate = registration => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate })
  }, [])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowReload(false)
    window.location.reload(true)
  }

  return (
    <Modal isOpen={showReload} toggle={() => setShowReload(!showReload)}>
      <ModalBody>
        <FormattedMessage
          id='serviceWorker.pageReloadedMessage'
          defaultMessage='A new version of this app is available. The page will be reloaded!'
        />
      </ModalBody>
      <ModalFooter>
        <Button color='primary' size='sm' onClick={reloadPage}>
          <FormattedMessage id='OK' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ServiceWorkerWrapper
