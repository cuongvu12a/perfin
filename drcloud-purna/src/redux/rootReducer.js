// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './reducers/auth'
import layout from './reducers/layout'

const rootReducer = combineReducers({
  auth,
  layout
})

export default rootReducer
