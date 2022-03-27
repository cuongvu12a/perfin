import { ACTION_TYPES } from '@store/actionTypes'

// ** Handles Layout Content Width (full / boxed)
export const handleContentWidth = value => dispatch => dispatch({ type: ACTION_TYPES.HANDLE_CONTENT_WIDTH, value })

// ** Handles Menu Collapsed State (Bool)
export const handleMenuCollapsed = value => dispatch => dispatch({ type: ACTION_TYPES.HANDLE_MENU_COLLAPSED, value })

// ** Handles Menu Hidden State (Bool)
export const handleMenuHidden = value => dispatch => dispatch({ type: ACTION_TYPES.HANDLE_MENU_HIDDEN, value })

// ** Handles RTL (Bool)
export const handleRTL = value => dispatch => dispatch({ type: ACTION_TYPES.HANDLE_RTL, value })
