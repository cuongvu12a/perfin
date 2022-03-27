// ** Routes Imports
import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
import SettingsRoutes from './SettingsRoutes'

// ** Document title
const TemplateTitle = '%s - Dr.Cloud'

// ** Default Route
const DefaultRoute = '/doctor-schedules'

// ** Merge Routes
const Routes = [
  ...MainRoutes,
  ...AuthRoutes,
  ...SettingsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
