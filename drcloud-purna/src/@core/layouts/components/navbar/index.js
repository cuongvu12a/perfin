// ** React Imports
import { Fragment } from 'react'
import { useSelector } from 'react-redux'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarMenuButton from './NavbarMenuButton'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const isUserLoggedIn = useSelector(state => state.auth.isUserLoggedIn)

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarMenuButton setMenuVisibility={setMenuVisibility} />
      </div>
      {isUserLoggedIn && <NavbarUser skin={skin} setSkin={setSkin} />}
    </Fragment>
  )
}

export default ThemeNavbar
