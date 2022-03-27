import { Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav className='nav-left' pills vertical>
      <NavItem>
        <NavLink active={activeTab === 'locationPermissions'} onClick={() => toggleTab('locationPermissions')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.locationPermissions' defaultMessage='Location Permissions' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'doctorPermissions'} onClick={() => toggleTab('doctorPermissions')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.doctorPermissions' defaultMessage='Doctor Permissions' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'users'} onClick={() => toggleTab('users')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.users' defaultMessage='Users' />
          </span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
