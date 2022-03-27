import { NavItem, NavLink } from 'reactstrap'
import { Menu } from 'react-feather'

const NavbarMenuButton = ({ setMenuVisibility }) => {
  return (
    <ul className='navbar-nav d-xl-none'>
      <NavItem className='mobile-menu mr-auto'>
        <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
          <Menu className='ficon' />
        </NavLink>
      </NavItem>
    </ul>
  )
}
export default NavbarMenuButton
