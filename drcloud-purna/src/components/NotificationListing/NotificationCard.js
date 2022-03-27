import React, { Fragment, useEffect, useState } from 'react'
import { Media } from 'reactstrap'
import { Bell, Check, Trash2 } from 'react-feather'
import classnames from 'classnames'
import { format } from 'date-fns'

const NotificationCard = ({ notification, handleMarkANotiAsRead, handleDeleteNoti }) => {
  const [isRead, setIsRead] = useState(notification.isRead)

  useEffect(() => {
    setIsRead(notification.isRead)
  }, [notification])

  const handleMarkAsRead = () => {
    if (!isRead) {
      handleMarkANotiAsRead(notification.notificationId)
      setIsRead(true)
    }
  }
  return (
    <div className='noti-card' onClick={handleMarkAsRead}>
      <Media className='h-100'>
        <Media className={classnames('noti-icon-wrapper', { 'noti-unread': !isRead })} left>
          <div className='noti-view-icon'>
            {isRead ? <Check color='white' size={20} /> : <Bell color='white' size={20} />}
          </div>
          <Trash2
            className='noti-delete-icon'
            size={20}
            color='white'
            onClick={e => {
              handleDeleteNoti(notification.notificationId)
              e.stopPropagation()
            }}
          />
        </Media>
        <Media className='noti-content-wrapper' body>
          <div className={classnames({ 'noti-unread-content': !isRead })}>
            <div className={classnames({ 'font-weight-bolder': !isRead })}>{notification.title}</div>
            <small className={classnames('noti-content-body', { 'font-weight-bold': !isRead })}>
              {notification.body}
            </small>
          </div>
          <div className='noti-date-time'>{format(notification.actualSentAtUnix, 'dd/MM/yyyy HH:mm')}</div>
        </Media>
      </Media>
    </div>
  )
}

export default NotificationCard
