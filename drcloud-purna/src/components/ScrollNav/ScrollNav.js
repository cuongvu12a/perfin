import { FormattedMessage } from 'react-intl'
import { Badge, Nav, NavItem, NavLink } from 'reactstrap'

const ScrollNav = ({ activeTab, toggleTab, navItems }) => {
  const onWheel = e => {
    const container = document.getElementById('container')
    const containerScrollPosition = document.getElementById('container').scrollLeft
    container.scrollTo({
      top: 0,
      left: containerScrollPosition - e.deltaY,
      behaviour: 'smooth'
    })
  }

  return (
    <Nav tabs className='slide-bar-tabs' id='container' onWheel={e => onWheel(e)}>
      {navItems.map((nav, index) => (
        <NavItem key={index}>
          <NavLink
            id={nav.name}
            active={activeTab === `${index}`}
            onClick={() => {
              toggleTab(`${index}`)
              document.getElementById(nav.name).scrollIntoView()
            }}
          >
            <FormattedMessage id={`title.${nav.name}`} defaultMessage={nav.name} />
            {nav.itemBadgeNumber > 0 ? (
              <Badge pill color='primary' className='ml-50'>
                {nav.itemBadgeNumber}
              </Badge>
            ) : null}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  )
}

export default ScrollNav
