import React from 'react'
import PermissionAlertCard from '@components/PermissionAlertCard'
import { AbilityContext } from '@utility/context/Can'

const withAuthorization = (Component = null, subject = '', isShowTitle = true) => {
  class AuthenticatedContainer extends React.Component {
    state = {
      isNotAuthorized: true,
      apiRoute: ''
    }
    static contextType = AbilityContext
    componentDidMount = () => {
      this.setState({ isNotAuthorized: !this.context.can('read', subject) })
    }

    handleError403 = url => {
      this.setState({ isNotAuthorized: true, apiRoute: url.replace(`${process.env.REACT_APP_API_URL}`, '') })
    }
    render() {
      if (!this.state.isNotAuthorized) {
        return <Component handleError403={this.handleError403} {...this.props} />
      } else {
        return <PermissionAlertCard title={subject} apiRoute={this.state.apiRoute} isShowTitle={isShowTitle} />
      }
    }
  }
  return AuthenticatedContainer
}

export default withAuthorization
