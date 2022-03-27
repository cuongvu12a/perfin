import { Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const Tabs = ({ activeTab }) => {
  return (
    <Nav className='nav-left' pills vertical>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'general'} to='/clinic-settings/general'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.generalSettings' defaultMessage='General Settings' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'locations'} to='/clinic-settings/locations'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.locations' defaultMessage='Locations' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'specialties'} to='/clinic-settings/specialties'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.specialties' defaultMessage='Specialties' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'doctors'} to='/clinic-settings/doctors'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.doctors' defaultMessage='Doctors' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'symptoms'} to='/clinic-settings/symptoms'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.symptomSuggestion' defaultMessage='Symptom Suggestion' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'users'} to='/clinic-settings/users'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.users' defaultMessage='Users' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'roles'} to='/clinic-settings/roles'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.userRoles' defaultMessage='User Roles' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'groups'} to='/clinic-settings/groups'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.userGroups' defaultMessage='User Groups' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'properties'} to='/clinic-settings/properties'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.properties' defaultMessage='Properties' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'forms'} to='/clinic-settings/forms'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.forms' defaultMessage='Forms' />
          </span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} active={activeTab === 'medicines'} to='/clinic-settings/medicines'>
          <span className='font-weight-bold'>
            <FormattedMessage id='title.medicineLibrary' defaultMessage='Medicine Library' />
          </span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
