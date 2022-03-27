import { Row, Col } from 'reactstrap'
import LanguageDropdown from '@components/LanguageDropdown'
import { Link } from 'react-router-dom'

import './auth-layout.scss'

const AuthLayout = ({ children, bannerSource }) => {
  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <img src={require('@assets/images/logo/logo-full.svg').default} alt='Logo Full' />
        </Link>
        <div className='lang-dropdown list-inline'>
          <LanguageDropdown />
        </div>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={bannerSource} alt='register' />
          </div>
        </Col>
        <Col className='d-flex auth-bg align-items-center px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            {children}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default AuthLayout
