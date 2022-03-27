// ** React Import
import { memo, useContext } from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { Menu, Clock, MapPin } from 'react-feather'
import { format } from 'date-fns'

import enLocale from '@assets/data/locales/en.fullcalendar'
import viLocale from '@assets/data/locales/vi.fullcalendar'
import { IntlContext } from '@utility/context/Internationalization'

const Calendar = ({ toggleSidebar, onEventClick, onDateClick, handleFetchEvents, closeRightSlidebar }) => {
  const intlContext = useContext(IntlContext)

  // ** Event Detail
  const renderEventContent = ({ event: eventInfo, view }) => {
    const occurrence = eventInfo._def.extendedProps
    const rangeString = `${format(occurrence.startTime, 'H:mm')} - ${format(occurrence.endTime, 'H:mm')}`

    return (
      <>
        {view.type === 'dayGridMonth' && (
          <div className='fc-event-main'>
            <div className='fc-event-main-frame'>
              <div className='fc-event-time'>{rangeString}</div>
              <div className='fc-event-title-container'>
                <div className='fc-event-title fc-sticky'>{occurrence.doctorName}</div>
              </div>
            </div>
          </div>
        )}
        {view.type === 'timeGridWeek' && (
          <div className='fc-event-main'>
            <div className='fc-event-main-frame'>
              <div className='fc-event-title-container'>
                <div className='fc-event-title fc-sticky font-weight-bold'>{occurrence.doctorName}</div>
              </div>
              <div className='fc-event-time'>{rangeString}</div>
              <div className='fc-event-time'>{occurrence.locationName}</div>
            </div>
          </div>
        )}
        {view.type === 'timeGridDay' && (
          <div className='fc-event-main'>
            <div className='fc-event-main-frame'>
              <div className='fc-event-title-container'>
                <div className='fc-event-title fc-sticky font-weight-bold'>{occurrence.doctorName}</div>
              </div>
              <div className='fc-event-time'>
                <Clock size={12} style={{ marginBottom: '2px' }} /> {rangeString}
              </div>
              <div className='fc-event-time'>
                <MapPin size={12} style={{ marginBottom: '2px' }} /> {occurrence.locationName}
              </div>
            </div>
          </div>
        )}
        {view.type === 'listMonth' && (
          <Row>
            <Col sm='4'>{occurrence.doctorName}</Col>
            <Col sm='8'>{occurrence.locationName}</Col>
          </Row>
        )}
      </>
    )
  }

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: handleFetchEvents,
    eventDisplay: 'block',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    dayMaxEvents: 2,
    // aspectRatio: 2.1,
    navLinks: true,
    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },
    eventClassNames: `bg-light-primary`, // bg-light-success
    allDaySlot: false,
    slotEventOverlap: false,
    scrollTime: '8:00',
    eventClick: ({ event, el }) => {
      onEventClick(event._def.extendedProps, el)
    },
    dateClick: info => {
      closeRightSlidebar()
      onDateClick(info.date)
    }
  }

  return (
    <Card className='with-sidebar'>
      <CardBody className='pb-0'>
        <FullCalendar
          {...calendarOptions}
          locales={[enLocale, viLocale]}
          locale={intlContext.locale}
          eventContent={renderEventContent}
        />
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
