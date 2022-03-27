import { Label } from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { format } from 'date-fns'

import { stringToRRuleSet } from '@utility/calendarHelper'
import { RecurrenceFrequencyEnum, RecurrenceByWeekdayEnum } from '@utility/constants'
import { reverseEnumObject } from '@utility/utils'

const OverviewTab = ({ scheduleDetails }) => {
  // Vars
  const rruleOptions = stringToRRuleSet(scheduleDetails.recurrenceString).rrules()[0]?.options
  // Hooks
  const intl = useIntl()

  return (
    <div>
      <div>
        <Label for='doctorName'>
          <FormattedMessage id='label.doctorName' defaultMessage='Doctor Name' />
        </Label>
        <h4>{scheduleDetails.doctor.doctorName}</h4>
      </div>
      <div>
        <Label for='locationName'>
          <FormattedMessage id='label.locationName' defaultMessage='Location Name' />
        </Label>
        <h4>{scheduleDetails.locationName}</h4>
      </div>
      <div>
        <Label for='startTime'>
          <FormattedMessage id='label.startTime' defaultMessage='Start time' />
        </Label>
        <h4>{format(scheduleDetails.startDateTimeUnix, 'HH:mm')}</h4>
      </div>
      <div>
        <Label for='endTime'>
          <FormattedMessage id='label.endTime' defaultMessage='End time' />
        </Label>
        <h4>{format(scheduleDetails.endDateTimeUnix, 'HH:mm')}</h4>
      </div>

      <div>
        <Label for='repeat'>
          <FormattedMessage id='label.repeat' defaultMessage='Repeat' />
        </Label>
        {!rruleOptions && (
          <h4>
            <FormattedMessage id='label.noRepeat' defaultMessage='No Repeat' />
          </h4>
        )}
        {rruleOptions && (
          <h4>
            <FormattedMessage
              id='label.repeatEveryMessage'
              defaultMessage='Every {interval} {freq}'
              values={{
                interval: rruleOptions.interval,
                freq: intl.formatMessage({
                  id: `enum.${reverseEnumObject(RecurrenceFrequencyEnum)[rruleOptions.freq]}`
                })
              }}
            />
            {rruleOptions.freq === RecurrenceFrequencyEnum.WEEKLY && (
              <FormattedMessage
                id='label.repeatOnMessage'
                defaultMessage=' on {weekdays}'
                values={{
                  weekdays: rruleOptions.byweekday
                    .map(d => intl.formatMessage({
                        id: `label.${reverseEnumObject(RecurrenceByWeekdayEnum)[d]}`
                      })
                    )
                    .join(', ')
                }}
              />
            )}
          </h4>
        )}
      </div>
      {rruleOptions && (
        <div>
          <Label for='ends'>
            <FormattedMessage id='label.ends' defaultMessage='Ends' />
          </Label>
          <h4>
            {!rruleOptions.until && !rruleOptions.count && <FormattedMessage id='label.never' defaultMessage='Never' />}
            {rruleOptions.until && (
              <FormattedMessage
                id='label.onDay'
                defaultMessage='On {until}'
                values={{ until: format(rruleOptions.until, 'dd/MM/yyyy') }}
              />
            )}
            {rruleOptions.count && (
              <FormattedMessage
                id='label.after'
                defaultMessage='After {count} occurrences'
                values={{ count: rruleOptions.count }}
              />
            )}
          </h4>
        </div>
      )}
    </div>
  )
}

export default OverviewTab
