// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Third Party Components
import { Bell } from 'react-feather'
import { Button, Badge, DropdownItem, UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { onMessageListener } from '@configs/firebaseConfig'
import Toast from '@utility/toast'
import {
  deleteNotificationsAPI,
  getCountOfUnreadNotiAPI,
  getNotificationsAPI,
  markAllNotificationAsReadAPI,
  markANotificationAsReadAPI
} from '@api/main'
import NotificationListing from '@components/NotificationListing'
import { getErrorMessage } from '@api/handleApiError'
import { IntlContext } from '@utility/context/Internationalization'

const pageSize = 10

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([])
  const [refreshToggle, setRefreshToggle] = useState(false)
  const [isRing, setIsRing] = useState(false)
  const [countOfUnread, setCountOfUnread] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  // ** Context
  const intlContext = useContext(IntlContext)

  useEffect(async () => {
    try {
      const res = await getNotificationsAPI(pageSize, 1, intlContext.locale)
      const count = await getCountOfUnreadNotiAPI()
      setNotifications(res.data.pageData)
      const paging = res.data.paging
      const totalCurrentItem = paging.pageSize * paging.pageNumber
      setHasMore(paging.totalItem - totalCurrentItem > 0)
      setPageNumber(paging.totalItem - totalCurrentItem > 0 ? 2 : 1)
      setCountOfUnread(count.data.count)
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }, [refreshToggle])

  // listen onMessage event
  onMessageListener(payload => {
    setRefreshToggle(!refreshToggle)
    setIsRing(true)
    setTimeout(() => setIsRing(false), 1000)
    Toast.showInfo(payload.notification.title, payload.notification.body)
  })

  // handle load more
  const loadMore = async () => {
    try {
      const res = await getNotificationsAPI(pageSize, pageNumber, intlContext.locale)
      setNotifications([...notifications, ...res.data.pageData])
      const paging = res.data.paging
      const totalCurrentItem = paging.pageSize * paging.pageNumber
      const remainingItem = paging.totalItem - totalCurrentItem
      if (remainingItem > 0) {
        setPageNumber(pageNumber + 1)
        setHasMore(true)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  // handle mark a Notification as read
  const handleMarkANotiAsRead = async notiId => {
    try {
      await markANotificationAsReadAPI(notiId)
      setCountOfUnread(countOfUnread - 1)
      const newNotification = notifications.find(noti => noti.notificationId === notiId)
      newNotification.isRead = true
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  // handle mark all Notification as read
  const markAllNotiAsRead = async () => {
    try {
      await markAllNotificationAsReadAPI()
      setRefreshToggle(!refreshToggle)
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  // handle delete a Notification
  const handleDeleteNoti = async notificationId => {
    try {
      await deleteNotificationsAPI(notificationId)
      const newNotifications = notifications.filter(noti => noti.notificationId !== notificationId)
      setNotifications(newNotifications)
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    }
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell className={classnames('', { 'animation-bell': isRing })} size={21} />
        {countOfUnread !== 0 && (
          <Badge pill color='danger' className='badge-up'>
            {countOfUnread < 10 ? countOfUnread : '9+'}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>
              <FormattedMessage id='title.notifications' defaultMessage='Notifications' />
            </h4>
            <Badge tag='div' color='light-primary' pill>
              {countOfUnread} <FormattedMessage id='title.new' defaultMessage='New' />
            </Badge>
          </DropdownItem>
        </li>
        {notifications.length > 0 && (
          <NotificationListing
            notifications={notifications}
            hasMore={hasMore}
            setNotifications={setNotifications}
            loadMore={loadMore}
            handleMarkANotiAsRead={handleMarkANotiAsRead}
            handleDeleteNoti={handleDeleteNoti}
          />
        )}
        <li className='dropdown-menu-footer'>
          <Button color='primary' block disabled={countOfUnread === 0} onClick={markAllNotiAsRead}>
            <FormattedMessage id='button.markAllAsRead' defaultMessage='Mark All As Read' />
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
