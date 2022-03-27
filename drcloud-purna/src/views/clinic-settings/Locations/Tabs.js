import { Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav className='nav-left' pills vertical>
      <NavItem>
        <NavLink active={activeTab === 'general'} onClick={() => toggleTab('general')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.general' defaultMessage='General' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'settings'} onClick={() => toggleTab('settings')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.settings' defaultMessage='Settings' />
          </span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
