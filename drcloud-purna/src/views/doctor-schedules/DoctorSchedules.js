import { Fragment, useState, useCallback, useEffect, useContext } from 'react'
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { addMilliseconds, startOfDay } from 'date-fns'

import { searchDoctorScheduleAPI } from '@api/main'
import { stringToRRuleSet } from '@utility/calendarHelper'
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import EditDoctorScheduleModal from './EditDoctorScheduleModal'
import RightSlideBarSchedule from './RightSlideBarSchedule'

import '@core/scss/react/apps/app-calendar.scss'
import { AbilityContext } from '@utility/context/Can'
import withAuthorization from '@hoc/withAuthorization'
import { FrontEndScreenEnum } from '@utility/constants'

const xScreenId = FrontEndScreenEnum.DoctorSchedules

const DoctorSchedules = ({ handleError403 }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [doctorScheduleModalOpen, setDoctorScheduleModalOpen] = useState(false)
  const [filter, setFilter] = useState({ keyword: '', locationId: null, specialtyId: null, doctorId: null })
  const [occurrences, setOccurrences] = useState([])
  const [selectedOccurrence, setSelectedOccurrence] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  // ** ACL Ability Context
  const ability = useContext(AbilityContext)

  const toggleSidebar = useCallback(open => setLeftSidebarOpen(open), [])
  const handleSearch = useCallback(filterData => {
    setFilter(filterData)
  }, [])

  const handleFetchEvents = useCallback(
    async (fetchInfo, successCallback, failureCallback) => {
      try {
        // fetch data from api
        const res = await searchDoctorScheduleAPI(
          {
            ...filter,
            fromDate: fetchInfo.start.getTime(),
            toDate: fetchInfo.end.getTime()
          },
          xScreenId
        )
        // get occurrences
        const allOccurrences = []
        res.data.forEach(schedule => {
          if (schedule.recurrenceString) {
            try {
              const duration = schedule.endDateTimeUnix - schedule.startDateTimeUnix
              const rruleset = stringToRRuleSet(schedule.recurrenceString, new Date(schedule.startDateTimeUnix))
              const rruleOccurrences = rruleset.between(fetchInfo.start, fetchInfo.end)
              const occurrences = rruleOccurrences.map(o => {
                return {
                  scheduleId: schedule.scheduleId,
                  startTime: o,
                  endTime: addMilliseconds(o, duration),
                  doctorName: schedule.doctorName,
                  locationName: schedule.locationName
                }
              })
              allOccurrences.push(...occurrences)
            } catch (error) {
              console.error('Parse recurrence string', schedule.recurrenceString, error)
            }
          } else {
            allOccurrences.push({
              scheduleId: schedule.scheduleId,
              startTime: new Date(schedule.startDateTimeUnix),
              endTime: new Date(schedule.endDateTimeUnix),
              doctorName: schedule.doctorName,
              locationName: schedule.locationName
            })
          }
        })
        const calendarEvents = allOccurrences.map(o => ({
          id: o.scheduleId,
          title: o.doctorName,
          start: o.startTime,
          end: o.endTime,
          extendedProps: o
        }))
        setOccurrences(allOccurrences)
        successCallback(calendarEvents)
      } catch (error) {
        if (error.httpStatusCode === 403) {
          handleError403(error.config.url)
        }
        failureCallback(error)
      }
    },
    [filter]
  )

  const closeRightSlidebar = useCallback(
    modalResult => {
      setSelectedOccurrence(null)
      if (modalResult === 'SAVED') {
        setFilter({ ...filter })
      }
      // Remove the highlight event on calendar
      document.querySelector('.fc-event.selected')?.classList.remove('selected')
    },
    [filter]
  )

  const handleOpenOccurenceDetails = useCallback(
    (data, el) => {
      if (
        selectedOccurrence &&
        data.scheduleId === selectedOccurrence.scheduleId &&
        data.startTime === selectedOccurrence.startTime
      ) {
        closeRightSlidebar()
      } else {
        setSelectedOccurrence(data)
        // Highlight event on calendar
        document.querySelector('.fc-event.selected')?.classList.remove('selected')
        el.classList.add('selected')
      }
    },
    [selectedOccurrence]
  )

  const handleAddScheduleOnDate = useCallback(date => {
    if (startOfDay(date) >= startOfDay(new Date()) && ability.can('write', 'doctorSchedules')) {
      setSelectedDate(date)
      setDoctorScheduleModalOpen(true)
    }
  }, [])

  const openEditModal = useCallback(() => {
    setDoctorScheduleModalOpen(true)
  }, [])

  const closeEditModal = modalResult => {
    setDoctorScheduleModalOpen(false)
    setSelectedDate(null)
    if (modalResult === 'SAVED') {
      setFilter({ ...filter })
    }
  }

  useEffect(() => {
    // Update right slide data
    if (selectedOccurrence) {
      const occurrence = occurrences.find(o => {
        return (
          o.scheduleId === selectedOccurrence.scheduleId &&
          startOfDay(o.startTime).getTime() === startOfDay(selectedOccurrence.startTime).getTime()
        )
      })
      setSelectedOccurrence(occurrence)
    }
  }, [occurrences])

  return (
    <Fragment>
      <div className='content-header row mb-2 pl-1'>
        <h2 className='content-header-title float-left mb-0'>
          <FormattedMessage id='title.doctorSchedules' defaultMessage='Doctor Schedules' />
        </h2>
      </div>
      <div className='app-calendar overflow-hidden border'>
        <Row noGutters>
          <Col
            id='app-calendar-sidebar'
            className={classnames('col app-calendar-sidebar flex-grow-0 d-flex flex-column', {
              show: leftSidebarOpen
            })}
          >
            <SidebarLeft onAddClick={openEditModal} onSearch={handleSearch} />
          </Col>
          <Col className='position-relative'>
            <Calendar
              toggleSidebar={toggleSidebar}
              onEventClick={handleOpenOccurenceDetails}
              onDateClick={handleAddScheduleOnDate}
              handleFetchEvents={handleFetchEvents}
              closeRightSlidebar={closeRightSlidebar}
            />
          </Col>
          <div
            className={classnames('body-content-overlay', {
              show: leftSidebarOpen === true
            })}
            onClick={() => toggleSidebar(false)}
          ></div>
        </Row>
      </div>

      <RightSlideBarSchedule
        open={!!selectedOccurrence}
        occurrence={selectedOccurrence}
        openEditModal={openEditModal}
        toggle={closeRightSlidebar}
        handleError403={handleError403}
      />

      {doctorScheduleModalOpen && (
        <EditDoctorScheduleModal
          open={doctorScheduleModalOpen}
          occurrence={selectedOccurrence}
          initDate={selectedDate}
          close={closeEditModal}
          handleError403={handleError403}
        />
      )}
    </Fragment>
  )
}

export default withAuthorization(DoctorSchedules, 'doctorSchedules')
