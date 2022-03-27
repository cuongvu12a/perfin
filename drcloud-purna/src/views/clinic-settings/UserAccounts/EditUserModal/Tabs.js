import { Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

const Tabs = ({ activeTab, isEditable, toggleTab }) => {
  return (
    <Nav className='nav-left' pills vertical>
      <NavItem>
        <NavLink active={activeTab === 'general'} onClick={() => toggleTab('general')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.generalSettings' defaultMessage='General Settings' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'information'} onClick={() => toggleTab('information')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.information' defaultMessage='Information' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'skills'} onClick={() => toggleTab('skills')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.skills' defaultMessage='Skills' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === 'userGroups'} onClick={() => toggleTab('userGroups')}>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.userGroups' defaultMessage='User Groups' />
          </span>
        </NavLink>
      </NavItem>
      {isEditable && (
        <NavItem>
          <NavLink active={activeTab === 'changePassword'} onClick={() => toggleTab('changePassword')}>
            <span className='font-weight-bold'>
              <FormattedMessage id='title.changePassword' defaultMessage='Change Password' />
            </span>
          </NavLink>
        </NavItem>
      )}
    </Nav>
  )
}

export default Tabs
