import { Badge } from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { format } from 'date-fns'

import { GenderEnum, ScheduleSlotAvailableDisplayConfig } from '@utility/constants'
import BaseTable from '@components/BaseTable'
import AvatarWrapper from '@components/AvatarWrapper'
import { reverseEnumObject } from '@utility/utils'

const AppointmentsTab = ({ slots }) => {
  const intl = useIntl()

  const customStyles = {
    rows: {
      style: {
        minHeight: '36px'
      }
    }
  }

  const appointmentColumns = [
    {
      name: <FormattedMessage id='label.time' defaultMessage='Time' />,
      minWidth: '60px',
      maxWidth: '60px',
      cell: row => <div className='font-weight-bold'>{format(row.startDateTimeUnix, 'H:mm')}</div>
    },
    {
      name: <FormattedMessage id='label.patient' defaultMessage='Patient' />,
      minWidth: '100px',
      maxWidth: '260px',
      cell: row => (
        <>
          {row.patient ? (
            <AvatarWrapper
              imgUrl={row.patient.avatar?.fileUrl}
              title={row.patient.fullName}
              subTitle={`${intl.formatMessage({
                id: `enum.${reverseEnumObject(GenderEnum)[row.patient.gender || GenderEnum.Male]}`
              })} - ${new Date(row.patient.birthdayUnix).getFullYear()}`}
              size='sm'
            />
          ) : (
            <div className='font-weight-bold'>{row.name}</div>
          )}
        </>
      )
    },
    {
      name: <FormattedMessage id='label.status' defaultMessage='Status' />,
      minWidth: '100px',
      maxWidth: '100px',
      cell: row => (
        <Badge color={ScheduleSlotAvailableDisplayConfig[row.status]?.color} pill>
          <FormattedMessage
            id={`enum.${ScheduleSlotAvailableDisplayConfig[row.status]?.title}`}
            defaultMessage={`${ScheduleSlotAvailableDisplayConfig[row.status]?.title}`}
          />
        </Badge>
      )
    }
  ]
  return (
    <BaseTable
      className='right-slide-table'
      customStyles={customStyles}
      pagination={false}
      columns={appointmentColumns}
      data={slots}
    />
  )
}

export default AppointmentsTab
