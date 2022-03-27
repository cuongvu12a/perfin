import { Button } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

const PillSelect = ({ options, value, onChange, disable }) => {
  if (!options || options.length === 0) {
    return (
      <h4>
        <FormattedMessage id='label.noData' defaultMessage='No Data' />
      </h4>
    )
  }

  return (
    <>
      {options.map((d, index) => (
        <Button
          className='round mr-50 mb-50 btn-toggle'
          size='sm'
          color='primary'
          key={index}
          outline={!(value === d.value)}
          onClick={() => onChange(d.value)}
          disabled={disable}
        >
          {d.label}
        </Button>
      ))}
    </>
  )
}

export default PillSelect
