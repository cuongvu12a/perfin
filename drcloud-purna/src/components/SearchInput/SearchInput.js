import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import { Search, X } from 'react-feather'
import debounce from 'lodash.debounce'

const SearchInput = ({ onChange }) => {
  const [value, setValue] = useState('')
  const intl = useIntl()

  const debouncedOnChange = useCallback(debounce(onChange, 400), [])

  return (
    <InputGroup className='input-group-merge'>
      <InputGroupAddon addonType='prepend'>
        <InputGroupText>
          <Search size={14} />
        </InputGroupText>
      </InputGroupAddon>
      <Input
        placeholder={intl.formatMessage({ id: 'placeholder.searchInput' })}
        value={value}
        onChange={e => {
          setValue(e.target.value)
          debouncedOnChange(e.target.value)
        }}
      />
      {!!value && (
        <InputGroupAddon addonType='append'>
          <InputGroupText
            className='btn'
            onClick={e => {
              setValue('')
              onChange('')
            }}
          >
            <X size={14} />
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export default SearchInput
