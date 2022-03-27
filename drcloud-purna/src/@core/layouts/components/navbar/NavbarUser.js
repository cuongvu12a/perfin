// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
import UserDropdown from './UserDropdown'
import NotificationDropdown from './NotificationDropdown'

const NavbarUser = () => {
  return (
    <ul className='nav navbar-nav align-items-center ml-auto'>
      <IntlDropdown />
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
