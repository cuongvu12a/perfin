import { Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { TabEnum, TitleTabEnum } from '@utility/constants'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav className='nav-left' pills vertical>
      {Object.keys(TabEnum).map(key => {
        const currentTab = TabEnum[key]
        return (
          <NavItem key={currentTab}>
            <NavLink active={activeTab === currentTab} onClick={() => toggleTab(currentTab)}>
              <span className='font-weight-bold'>
                <FormattedMessage id={TitleTabEnum[key].id} defaultMessage={TitleTabEnum[key].default} />
              </span>
            </NavLink>
          </NavItem>
        )
      })}
    </Nav>
  )
}

export default Tabs
