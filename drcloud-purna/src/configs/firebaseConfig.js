import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging'

import { Storage, STORAGE_KEYS } from '@utility/storage'
import Toast from '@utility/toast'
import { updateDeviceTokenAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAws5hRDvI8TsPpbGJri8k32mYZFmnZv5M",
  authDomain: "drcloud-1ee63.firebaseapp.com",
  projectId: "drcloud-1ee63",
  storageBucket: "drcloud-1ee63.appspot.com",
  messagingSenderId: "739934592992",
  appId: "1:739934592992:web:9c93fbd752974546391585"
})

const messaging = getMessaging(firebaseApp)
const publicKey = process.env.REACT_APP_FIREBASE_VAPID_KEY
let onMessageCallback = null

export const getDeviceToken = async () => {
  Notification.requestPermission().then(async permission => {
    const currentToken = Storage.getItem(STORAGE_KEYS.token)
    const currentDeviceToken = Storage.getItem(STORAGE_KEYS.deviceToken)
    if (permission === 'granted' && currentToken) {
      try {
        const newDeviceToken = await getToken(messaging, { vapidKey: publicKey })
        try {
          if (newDeviceToken && (!currentDeviceToken || currentDeviceToken !== newDeviceToken)) {
            await updateDeviceTokenAPI({
              deviceToken: newDeviceToken,
              lang: localStorage.getItem('language') || 'vi',
              platform: 'web'
            })
            Storage.setItem(STORAGE_KEYS.deviceToken, newDeviceToken)
          }
        } catch (error) {
          Toast.showError('toast.error', getErrorMessage(error))
        }
      } catch (error) {
        console.warn('[firebaseConfig] get device token error', error)
      }
    }
  })
}

export const deleteDeviceToken = () => {
  Notification.requestPermission().then(permission => {
    const currentDeviceToken = Storage.getItem(STORAGE_KEYS.deviceToken)

    if (permission === 'granted' && currentDeviceToken) {
      deleteToken(messaging)
        .then(() => {
          Storage.clear(STORAGE_KEYS.deviceToken)
        })
        .catch(error => {
          console.log('error', getErrorMessage(error))
        })
    }
  })
}

getDeviceToken()

onMessage(messaging, payload => {
  console.log('Message received. ', payload)
  if (!!onMessageCallback) {
    onMessageCallback(payload)
  }
})

export const onMessageListener = callback => {
  onMessageCallback = callback
}
