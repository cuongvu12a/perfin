import { ACTION_TYPES } from '@store/actionTypes'

// **  Initial State
const initialState = {
  isCheckingRememberedUser: true,
  isUserLoggedIn: false,
  userData: null,
  userPermission: [],
  clinicData: {
    clinicName: '',
    locations: [],
    specialties: [],
    doctors: []
  }
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHECK_REMENBERED_USER_DONE:
      return {
        ...state,
        isCheckingRememberedUser: false,
        isUserLoggedIn: action.data.isUserLoggedIn,
        userData: action.data.user
      }
    case ACTION_TYPES.LOGIN:
      return {
        ...state,
        isUserLoggedIn: true,
        userData: action.data.user
      }
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        isUserLoggedIn: false,
        userData: null,
        userPermission: [],
        clinicData: {
          clinicName: '',
          locations: [],
          specialties: [],
          doctors: []
        }
      }
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        userData: action.data.user,
        clinicData: action.data.clinic,
        userPermission: action.data.userPermission
      }
    default:
      return state
  }
}

export default authReducer
