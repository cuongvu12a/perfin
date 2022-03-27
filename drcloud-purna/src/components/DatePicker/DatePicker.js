import { format } from 'date-fns'
import { useContext, useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import * as locales from 'react-date-range/dist/locale'
import { Calendar as Icon } from 'react-feather'
import { Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import classNames from 'classnames'

import { IntlContext } from '@utility/context/Internationalization'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DatePicker = ({ id, value, onChange, top, disabled, ...rest }) => {
  const [open, setOpen] = useState(false)
  const [dateString, setDateString] = useState('')
  const containerRef = useRef()
  const intlContext = useContext(IntlContext)

  useEffect(() => {
    setDateString(value ? format(value, 'dd/MM/yyyy') : '')
  }, [value])

  const handleDateChange = item => {
    onChange(item)
    setOpen(false)
  }

  // Handle click outside
  useEffect(() => {
    function onClickOnPage(e) {
      if (!containerRef || !containerRef.current) {
        return
      }

      let didClickInside = false
      let parentElement = e.target
      while (parentElement) {
        if (parentElement === containerRef.current) {
          didClickInside = true
          break
        }
        parentElement = parentElement.parentElement
      }
      if (didClickInside) {
        return
      }

      // Clicked outside of the date range picker - cancel selection
      setOpen(false)
    }

    document.body.addEventListener('click', onClickOnPage, true)

    return () => {
      document.body.removeEventListener('click', onClickOnPage, true)
    }
  }, [])

  return (
    <div className={classNames('date-picker', { top, disabled })}>
      <InputGroup className='date-picker-input input-group-merge'>
        <Input id={id} readOnly value={dateString} onClick={() => !disabled && setOpen(true)} disabled={disabled} />
        <InputGroupAddon addonType='append' onClick={() => !disabled && setOpen(true)}>
          <InputGroupText>
            <Icon size={14} />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {open && (
        <div className='date-picker-position calendar'>
          <div ref={containerRef}>
            <Calendar
              onChange={handleDateChange}
              date={value}
              locale={locales[intlContext.locale]}
              weekStartsOn={1}
              {...rest}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
