import Avatar from '@core/components/avatar'
import defaultAvatar from '@assets/images/avatar-blank.png'

const AvatarWrapper = ({ imgUrl, title, subTitle, size, titleColor, subTitleColor }) => {
  return (
    <div className='avatar-wrapper'>
      <Avatar className='mb-0' img={imgUrl || defaultAvatar} size={size} />
      {!size && (
        <div className='md title-wrapper'>
          <h6 className={`w-100 mb-0 font-weight-bolder text-truncate text-${titleColor}`}>{title}</h6>
          <span className={`w-100 sub-title-md text-truncate text-${subTitleColor}`}>{subTitle}</span>
        </div>
      )}
      {size === 'lg' && (
        <div className='lg title-wrapper ml-1'>
          <h3 className={`w-100 mb-0 font-weight-bolder text-truncate text-${titleColor}`}>{title}</h3>
          <h6 className={`w-100 text-truncate text-${subTitleColor}`}>{subTitle}</h6>
        </div>
      )}
      {size === 'sm' && (
        <div className='sm title-wrapper'>
          <span className={`w-100 title-sm font-weight-bolder text-truncate text-${titleColor}`}>{title}</span>
          <span className={`w-100 sub-title-sm text-truncate text-${subTitleColor}`}>{subTitle}</span>
        </div>
      )}
    </div>
  )
}

export default AvatarWrapper
