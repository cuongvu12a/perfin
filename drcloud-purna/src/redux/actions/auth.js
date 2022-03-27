import { getUserInfoAPI, getClinicInfoAPI, getUserPermissionAPI, refreshToken } from '@api/main'
import { Storage, STORAGE_KEYS } from '@utility/storage'
import { ACTION_TYPES } from '@store/actionTypes'
import { getDeviceToken, deleteDeviceToken } from '@configs/firebaseConfig'
import { FeatureEnum, PermissionTypeEnum, ScreenEnum } from '@utility/constants'

// ** Handle User Login
export const loginAC = data => {
  return dispatch => {
    dispatch({
      type: ACTION_TYPES.LOGIN,
      data
    })

    // ** Add to user, accessToken & refreshToken to localStorage
    Storage.setItem(STORAGE_KEYS.userData, data.user)
    Storage.setItem(STORAGE_KEYS.token, data.token)

    // Get device token
    getDeviceToken()
  }
}

/**
 * Handle User Logout
 * @param {boolean} isSessionExpired
 */
export const logoutAC = () => {
  return dispatch => {
    dispatch({ type: ACTION_TYPES.LOGOUT })

    // ** Remove user, accessToken & refreshToken from localStorage
    Storage.clear(STORAGE_KEYS.userData)
    Storage.clear(STORAGE_KEYS.token)

    // Delete device token
    deleteDeviceToken()
  }
}

// ** Check remenbered user
export const checkRememberedUserAC = () => {
  return async dispatch => {
    try {
      if (!!Storage.getItem(STORAGE_KEYS.userData) && !!Storage.getItem(STORAGE_KEYS.token)) {
        await refreshToken()
        dispatch({
          type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
          data: {
            isUserLoggedIn: true,
            user: Storage.getItem(STORAGE_KEYS.userData)
          }
        })
      } else {
        dispatch({
          type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
          data: {
            isUserLoggedIn: false,
            user: null
          }
        })
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
        data: {
          isUserLoggedIn: false,
          user: null
        }
      })
    }
  }
}

export const getUserInfoAC = () => {
  return async dispatch => {
    try {
      const userRes = await getUserInfoAPI()
      const clinicRes = await getClinicInfoAPI()
      const res = await getUserPermissionAPI()
      const featureIds = res.data.frontendFeatureIds
      const screenIds = res.data.screenPermissions
      const actions = featureIds?.map(feature => FeatureEnum[feature].action)
      const features = { action: actions, subject: 'appointments' }
      const screens = screenIds
        ?.filter(screen => screen.permissionTypeId !== PermissionTypeEnum.None)
        .map(screen => ({
          action: screen.permissionTypeId === PermissionTypeEnum.Write ? ['read', 'write'] : ['read'],
          subject: ScreenEnum[screen.frontendScreenId]
        }))
      const permission = screens.concat(features)
      const userRoleId = res.data.roleId
      const userGroupIds = res.data.groupIds
      dispatch({
        type: ACTION_TYPES.UPDATE_USER,
        data: {
          user: { ...userRes.data, userRoleId, userGroupIds },
          clinic: clinicRes.data,
          userPermission: permission
        }
      })
      Storage.setItem(STORAGE_KEYS.userData, { ...userRes.data, userRoleId, userGroupIds })
    } catch (error) {}
  }
}
