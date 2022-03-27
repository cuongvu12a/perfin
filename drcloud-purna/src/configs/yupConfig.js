import { setLocale } from 'yup'

setLocale({
  mixed: {
    required: JSON.stringify({
      id: 'formError.required',
      defaultMessage: 'This field is required',
      values: { path: '${path}' }
    }),
    notType: JSON.stringify({
      id: 'formError.notType',
      defaultMessage: 'This field must be a {type}',
      values: { path: '${path}', type: '${type}' }
    })
  },
  string: {
    default: JSON.stringify({
      id: 'formError.invalid',
      defaultMessage: 'This value is invalid',
      values: { path: '${path}' }
    }),
    email: JSON.stringify({
      id: 'formError.email',
      defaultMessage: 'This field must be a valid email',
      values: { path: '${path}' }
    }),
    min: JSON.stringify({
      id: 'formError.minLength',
      defaultMessage: 'This field must be at least {min} characters',
      values: { path: '${path}', min: '${min}' }
    }),
    max: JSON.stringify({
      id: 'formError.maxLength',
      defaultMessage: 'This field must be at most {max} characters',
      values: { path: '${path}', max: '${max}' }
    })
  },
  number: {
    default: JSON.stringify({
      id: 'formError.invalid',
      defaultMessage: 'This value is invalid',
      values: { path: '${path}' }
    }),
    min: JSON.stringify({
      id: 'formError.minNumber',
      defaultMessage: 'This field must be greater than or equal to {min}',
      values: { path: '${path}', min: '${min}' }
    }),
    max: JSON.stringify({
      id: 'formError.maxNumber',
      defaultMessage: 'This field must be less than or equal to {max}',
      values: { path: '${path}', max: '${max}' }
    }),
    integer: JSON.stringify({
      id: 'formError.invalid',
      defaultMessage: 'This value is invalid',
      values: { path: '${path}' }
    }),
    lessThan: JSON.stringify({
      id: 'formError.lessThan',
      defaultMessage: 'This field must always be less than {less}',
      values: { path: '${path}', less: '${less}' }
    }),
    moreThan: JSON.stringify({
      id: 'formError.moreThan',
      defaultMessage: 'This field must always be greater than {more}',
      values: { path: '${path}', more: '${more}' }
    })
  },
  array: {
    default: JSON.stringify({
      id: 'formError.invalid',
      defaultMessage: 'This value is invalid',
      values: { path: '${path}' }
    }),
    min: JSON.stringify({
      id: 'formError.minLengthArray',
      defaultMessage: 'This field must be at least {min} items',
      values: { path: '${path}', min: '${min}' }
    }),
    max: JSON.stringify({
      id: 'formError.maxLengthArray',
      defaultMessage: 'This field must be at most {max} items',
      values: { path: '${path}', max: '${max}' }
    })
  }
})
