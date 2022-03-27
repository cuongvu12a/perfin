// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@core/components/avatar'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { logoutAC } from '@store/actions/auth'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Settings, Power, FolderPlus } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@assets/images/avatar-blank.png'
import { FormattedMessage } from 'react-intl'

import UserSettingsModal from '@views/user-settings'
import { version } from '../../../../../package.json'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)
  const clinicData = useSelector(state => state.auth.clinicData)

  // ** State
  const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false)

  //** Vars
  const userAvatar = userData?.avatar?.fileUrl || defaultAvatar

  const toggleUserSettingsModal = e => {
    if (!!e) {
      e.preventDefault()
    }
    setUserSettingsModalOpen(!userSettingsModalOpen)
  }

  return (
    <Fragment>
      <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
        <DropdownToggle
          href='/'
          tag='a'
          className='nav-link dropdown-user-link dropdown-toggle'
          onClick={e => e.preventDefault()}
        >
          <div className='user-nav d-sm-flex d-none'>
            <span className='user-name font-weight-bold'>{clinicData?.clinicName || ''}</span>
            <span className='user-status'>{userData?.userName}</span>
          </div>
          <Avatar img={userAvatar} imgHeight='40' imgWidth='40' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag={Link} to='/' onClick={toggleUserSettingsModal}>
            <User size={14} className='mr-75' />
            <span className='align-middle'>
              <FormattedMessage id='title.mySettings' defaultMessage='My Settings' />
            </span>
          </DropdownItem>
          <DropdownItem tag={Link} to='/clinic-settings' onClick={() => {}}>
            <Settings size={14} className='mr-75' />
            <span className='align-middle'>
              <FormattedMessage id='title.clinicSettings' defaultMessage='Clinic Settings' />
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem tag={Link} to='/' onClick={() => dispatch(logoutAC())}>
            <Power size={14} className='mr-75' />
            <span className='align-middle'>
              <FormattedMessage id='title.logout' defaultMessage='Logout' />
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <div className='version'>
            <FormattedMessage id='title.version' defaultMessage='Version' /> {version}
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
      {userSettingsModalOpen && <UserSettingsModal open={userSettingsModalOpen} toggle={toggleUserSettingsModal} />}
    </Fragment>
  )
}

export default UserDropdown
