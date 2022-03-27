import {
  format,
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { useEffect, useRef, useState, useContext } from 'react'
import { DateRangePicker as DateRange, createStaticRanges } from 'react-date-range'
import * as locales from 'react-date-range/dist/locale'
import { Calendar } from 'react-feather'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { IntlContext } from '@utility/context/Internationalization'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRangePicker = ({ id, value, onChange, top, disabled, ...rest }) => {
  const isTabletDown = (window?.innerWidth || 1200) < 992
  const [open, setOpen] = useState(false)
  const [rangeString, setRangeString] = useState('')
  const [staticRanges, setStaticRanges] = useState([])
  const containerRef = useRef()
  const intlContext = useContext(IntlContext)
  const intl = useIntl()

  useEffect(() => {
    if (!open) {
      return
    }

    const ranges = createStaticRanges([
      {
        label: intl.formatMessage({ id: 'label.today' }),
        range: () => ({
          startDate: startOfDay(new Date()),
          endDate: endOfDay(new Date())
        })
      },
      {
        label: intl.formatMessage({ id: 'label.yesterday' }),
        range: () => ({
          startDate: startOfDay(addDays(new Date(), -1)),
          endDate: endOfDay(addDays(new Date(), -1))
        })
      },

      {
        label: intl.formatMessage({ id: 'label.thisWeek' }),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfWeek(new Date())
        })
      },
      {
        label: intl.formatMessage({ id: 'label.lastWeek' }),
        range: () => ({
          startDate: startOfWeek(addDays(new Date(), -7)),
          endDate: endOfWeek(addDays(new Date(), -7))
        })
      },
      {
        label: intl.formatMessage({ id: 'label.thisMonth' }),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date())
        })
      },
      {
        label: intl.formatMessage({ id: 'label.lastMonth' }),
        range: () => ({
          startDate: startOfMonth(addMonths(new Date(), -1)),
          endDate: endOfMonth(addMonths(new Date(), -1))
        })
      }
    ])
    setStaticRanges(ranges)
  }, [open])

  useEffect(() => {
    if (!value) {
      setRangeString('')
    } else {
      setRangeString(`${format(value.startDate, 'dd/MM/yyyy')} - ${format(value.endDate, 'dd/MM/yyyy')}`)
    }
  }, [value])

  const handleDateChange = item => {
    onChange({ startDate: item.selection.startDate, endDate: endOfDay(item.selection.endDate) })
    if (item.selection.startDate < item.selection.endDate) {
      setOpen(false)
    }
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
        <Input
          id={id}
          readOnly
          value={rangeString}
          onClick={() => !disabled && setOpen(true)}
          disabled={disabled}
          autoFocus
        />
        <InputGroupAddon addonType='append' onClick={() => !disabled && setOpen(true)}>
          <InputGroupText className='cursor-pointer'>
            <Calendar size={14} />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {open && (
        <div className='date-picker-position' onClick={() => {}}>
          <div ref={containerRef}>
            <DateRange
              ranges={[{ ...value, key: 'selection' }]}
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={isTabletDown ? 1 : 2}
              direction={isTabletDown ? 'vertical' : 'horizontal'}
              staticRanges={staticRanges}
              inputRanges={[]}
              locale={locales[intlContext.locale]}
              weekStartsOn={1}
              scroll={{ enabled: isTabletDown }}
              {...rest}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
