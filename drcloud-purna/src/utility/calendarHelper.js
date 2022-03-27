import _ from 'lodash'
import moment from 'moment'
import RRule, { rrulestr } from 'rrule'
import { startOfDay } from 'date-fns'
import { reverseEnumObject } from '@utility/utils'
import { RecurrenceFrequencyEnum, RecurrenceByWeekdayEnum } from '@utility/constants'

/**
 * Demo:
 * const rruleSet = stringToRRuleSet(
 *   'RRULE:FREQ=WEEKLY;BYDAY=MO,FR\nEXDATE:20210910T093000Z',
 *   new Date(Date.UTC(2021, 8, 1, 9, 30, 0))
 * )
 */
export const stringToRRuleSet = (s, startTime = new Date()) => {
  const sanitizedString = s
    .split('\n')
    .filter(l => l.startsWith('RRULE') || l.startsWith('EXDATE'))
    .join('\n')
  const rruleString = `DTSTART:${moment.utc(startTime).format('YYYYMMDD[T]HHmmss[Z]')}\n${sanitizedString}`
  const rruleSet = rrulestr(rruleString, { forceset: true })
  rruleSet.rdate(startTime)
  return rruleSet
}

/**
 * const rruleSet = new RRuleSet()
 *   rruleSet.rrule(
 *     new RRule({
 *       freq: RRule.WEEKLY,
 *       byweekday: [RRule.MO, RRule.FR],
 *       dtstart: new Date(Date.UTC(2021, 8, 8, 9, 30, 0))
 *     })
 * )
 * rruleSet.exdate(new Date(Date.UTC(2021, 8, 10,  9, 30, 0)))
 * console.log('sdd', rRuleSetToString(rruleSet))
 *
 * @param {RRule}  rrule
 *
 */
export const rruleToString = rrule => {
  if (!rrule || !rrule.options) {
    return ''
  }

  let rruleString = `RRULE:FREQ=${reverseEnumObject(RecurrenceFrequencyEnum)[rrule.options.freq]};INTERVAL=${
    rrule.options.interval
  }`
  if (rrule.options.freq === RecurrenceFrequencyEnum.WEEKLY && rrule.options.byweekday.length > 0) {
    const reversedWeekdayEnum = reverseEnumObject(RecurrenceByWeekdayEnum)
    rruleString = `${rruleString};BYDAY=${rrule.options.byweekday.map(w => reversedWeekdayEnum[w]).join(',')}`
  }
  if (rrule.options.count > 0) {
    rruleString = `${rruleString};COUNT=${rrule.options.count}`
  } else if (rrule.options.until) {
    rruleString = `${rruleString};UNTIL=${moment.utc(rrule.options.until).format('YYYYMMDD[T]HHmmss[Z]')}`
  }
  return rruleString
}

/**
 *
 * @param {RRule} rrule1
 * @param {RRule} rrule2
 */
export const isEqualRRule = (rrule1, rrule2) => {
  if (!rrule1.options && !rrule2.options) {
    return true
  }
  if (!rrule1.options || !rrule2.options) {
    return false
  }
  if (
    rrule1.options.freq === rrule2.options.freq &&
    rrule1.options.interval === rrule2.options.interval &&
    _.isEqual(_.sortBy(rrule1.options.byweekday), _.sortBy(rrule2.options.byweekday)) &&
    ((!rrule1.options.count && !rrule1.options.count && !rrule1.options.until && !rrule2.options.until) ||
      (!!rrule1.options.count && !!rrule1.options.count && rrule1.options.count === rrule2.options.count) ||
      (!!rrule1.options.until &&
        !!rrule2.options.until &&
        startOfDay(rrule1.options.until).getTime() === startOfDay(rrule2.options.until).getTime()))
  ) {
    return true
  }
  return false
}
