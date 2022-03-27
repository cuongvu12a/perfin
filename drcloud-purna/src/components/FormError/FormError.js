import { FormattedMessage } from 'react-intl'
import { FormFeedback } from 'reactstrap'

const FormError = ({ children }) => {
  try {
    const data = JSON.parse(children)
    if (!!data.id) {
      return (
        <FormFeedback>
          <FormattedMessage {...data} />
        </FormFeedback>
      )
    }
  } catch {
    // Couldn't parse as JSON; do nothing
  }
  return (
    <FormFeedback>
      <FormattedMessage id={children} defaultMessage={children} />
    </FormFeedback>
  )
}

export default FormError
