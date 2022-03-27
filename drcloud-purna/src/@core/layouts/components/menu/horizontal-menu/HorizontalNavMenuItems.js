// ** React Imports
import { useContext } from 'react'

// ** Ability Context
import { AbilityContext } from '@utility/context/Can'

// ** Menu Components Imports
import HorizontalNavMenuLink from './HorizontalNavMenuLink'
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup'
import {
  resolveHorizontalNavMenuItemComponent as resolveNavItemComponent,
  canViewMenuGroup,
  canViewMenuItem
} from '@core/layouts/utils'

const HorizontalNavMenuItems = props => {
  // ** Context
  const ability = useContext(AbilityContext)

  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink
  }

  // ** Render Nav Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return canViewMenuGroup(ability, item) && <TagName item={item} index={index} key={item.id} {...props} />
    }
    return canViewMenuItem(ability, item) && <TagName item={item} index={index} key={item.id} {...props} />
  })

  return RenderNavItems
}

export default HorizontalNavMenuItems
