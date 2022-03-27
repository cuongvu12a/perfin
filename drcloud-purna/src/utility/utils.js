// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'numeric', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const enumToSelectOptions = obj => {
  const keys = Object.keys(obj)
  return keys.map(key => ({
    value: obj[key],
    label: key
  }))
}

export const arrayToSelectOptions = (arr, labelKey, valueKey, conditionKey) => {
  if (Array.isArray(arr)) {
    return arr.map(c => {
      return {
        value: c[valueKey],
        label: c[labelKey],
        condition: c[conditionKey]
      }
    })
  }
}

export const objToSelectOptions = (obj, labelKey, valueKey) => {
  return {
    value: obj[valueKey],
    label: obj[labelKey]
  }
}

export const enumToDialogOptions = (obj, formatKey) => {
  const option = {}
  const keys = Object.keys(obj)
  keys.forEach(key => {
    option[obj[key]] = formatKey ? formatKey(key) : key
  })
  return option
}

export const reverseEnumObject = obj => {
  const option = {}
  const keys = Object.keys(obj)
  keys.forEach(key => {
    option[obj[key]] = key
  })
  return option
}

export const reversePropertyObject = obj => {
  const properties = []
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  keys?.map((key, index) => {
    properties.push({
      propertyId: key,
      value: !!values[index] ? values[index].toString() : ''
    })
  })
  return properties
}

export const reverseMedicineObject = array => {
  return array.map(c => {
    return {
      medicineId: c.medicine.medicineId,
      amount: c.amount,
      unitTypeEnum: c.unitTypeEnum,
      usage: c.usage
    }
  })
}

export const checkObjectNullable = obj => {
  const values = Object.values(obj)
  return !values.some(item => !!item)
}
