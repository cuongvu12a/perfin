// ** React Imports
import { useState, createContext } from 'react'

// ** Intl Provider Import
import { IntlProvider } from 'react-intl'

// ** Core Language Data
import messagesEn from '@core/assets/data/locales/en.json'
import messagesVi from '@core/assets/data/locales/vi.json'

// ** User Language Data
import userMessagesEn from '@assets/data/locales/en.json'
import userMessagesVi from '@assets/data/locales/vi.json'
import { Storage, STORAGE_KEYS } from '@utility/storage'
import { updateDeviceTokenAPI } from '@api/main'

// ** Menu msg obj
const menuMessages = {
  en: { ...messagesEn, ...userMessagesEn },
  vi: { ...messagesVi, ...userMessagesVi }
}

// ** Create Context
const Context = createContext()

const IntlProviderWrapper = ({ children }) => {
  const initLang = localStorage.getItem('language') || 'vi'
  // ** States
  const [locale, setLocale] = useState(initLang)
  const [messages, setMessages] = useState(menuMessages[initLang])

  // ** Switches Language
  const switchLanguage = language => {
    setLocale(language)
    setMessages(menuMessages[language])
    localStorage.setItem('language', language)

    const currentDeviceToken = Storage.getItem(STORAGE_KEYS.deviceToken)
    if (!!currentDeviceToken) {
      updateDeviceTokenAPI({
        deviceToken: currentDeviceToken,
        lang: language,
        platform: 'web'
      })
        .then()
        .catch(error => {
          console.warn('[IntlProviderWrapper] update device token error', error)
        })
    }
  }

  return (
    <Context.Provider value={{ locale, switchLanguage }}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale='vi'>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}

export { IntlProviderWrapper, Context as IntlContext }
