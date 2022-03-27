import {
  ModalBody,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Edit, Trash, X } from 'react-feather'
import { useState, useEffect } from 'react'
import { startOfDay, format } from 'date-fns'
import classnames from 'classnames'

import { deleteDoctorScheduleAPI, getAppointmentByScheduleIdAPI, getScheduleByIdAPI } from '@api/main'
import { getErrorMessage } from '@api/handleApiError'
import ScrollNav from '@components/ScrollNav'
import { enumToDialogOptions } from '@utility/utils'
import {
  EditDoctorScheduleApplyToEnum,
  FrontEndScreenEnum,
  KeyBoardEnum,
  AppointmentStatusEnum
} from '@utility/constants'
import Toast from '@utility/toast'
import Dialog from '@utility/dialog'
import useKeypress from '@hooks/useKeyPress'
import OverviewTab from './OverviewTab'
import AppointmentsTab from './AppointmentsTab'
import { Can } from '@utility/context/Can'
import AvatarWrapper from '@components/AvatarWrapper'

const xScreenId = FrontEndScreenEnum.DoctorSchedules

const RightSlidebarSchedule = ({ open, occurrence, openEditModal, toggle, handleError403 }) => {
  const [activeTab, setActiveTab] = useState('0')
  const [appointmentLength, setAppointmentLength] = useState(0)
  const [appointmentSlots, setAppointmentSlots] = useState([])
  const [scheduleDetails, setScheduleDetails] = useState()
  const navItems = [{ name: 'overview' }, { name: 'appointments', itemBadgeNumber: appointmentLength }]

  const intl = useIntl()

  useEffect(async () => {
    try {
      if (!occurrence) {
        return
      }
      const scheduleRes = await getScheduleByIdAPI(occurrence.scheduleId, xScreenId)
      setScheduleDetails(scheduleRes.data)
      const appointmentsRes = await getAppointmentByScheduleIdAPI(
        occurrence.scheduleId,
        occurrence.startTime.getTime(),
        occurrence.endTime.getTime(),
        xScreenId
      )
      // Calculate slots
      const slots = []
      let appLength = 0
      let timeIdx = occurrence.startTime.getTime()
      while (timeIdx < occurrence.endTime.getTime()) {
        const slot = appointmentsRes.data.find(a => a.startDateTimeUnix === timeIdx)
        if (slot && slot.details && slot.details.length > 0) {
          if (scheduleRes.data.numberOfAppointmentsPerSlot === 1 && slot.details.length === 1) {
            slots.push({
              startDateTimeUnix: timeIdx,
              patient: slot.details[0].patient,
              status: slot.details[0].appointmentStatusId === AppointmentStatusEnum.NotApproved ? 'notApproved' : 'full'
            })
          } else {
            slots.push({
              startDateTimeUnix: timeIdx,
              name: `${slot.details.length} patients`,
              status: slot.details.length >= scheduleRes.data.numberOfAppointmentsPerSlot ? 'full' : 'available'
            })
          }
          appLength += slot.details.length
        } else {
          slots.push({
            startDateTimeUnix: timeIdx,
            status: 'available'
          })
        }
        timeIdx = timeIdx + scheduleRes.data.slotTimeSpan * 60 * 1000 // slotTimeSpan in minutes
      }
      setAppointmentSlots(slots)
      setAppointmentLength(appLength)
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }, [occurrence])

  useEffect(() => {
    if (open) {
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.querySelector('body').style.overflow = 'auto'
    }
  }, [open])

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  useKeypress(KeyBoardEnum.Escape, () => {
    toggle()
  })

  const handleDelete = async () => {
    try {
      let dialogResult = {}
      if (!scheduleDetails.recurrenceString) {
        dialogResult = await Dialog.showQuestion({
          title: intl.formatMessage({ id: 'dialog.deleteScheduleTitle' }),
          text: intl.formatMessage({ id: 'dialog.deleteScheduleMessage' }),
          confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
      } else {
        dialogResult = await Dialog.showRadioInput({
          title: intl.formatMessage({ id: 'dialog.deleteScheduleTitle' }),
          text: intl.formatMessage({ id: 'dialog.deleteScheduleMessage' }),
          options: enumToDialogOptions(EditDoctorScheduleApplyToEnum, key => {
            return intl.formatMessage({ id: `enum.${key}` })
          }),
          confirmButtonText: intl.formatMessage({ id: 'button.delete' }),
          cancelButtonText: intl.formatMessage({ id: 'button.cancel' })
        })
      }
      if (!dialogResult.isConfirmed) {
        return
      }

      await deleteDoctorScheduleAPI(
        scheduleDetails.scheduleId,
        {
          occurrenceStart: occurrence.startTime.getTime(),
          editApplyTo: isNaN(parseInt(dialogResult.value))
            ? EditDoctorScheduleApplyToEnum.ThisOccurrence
            : parseInt(dialogResult.value)
        },
        xScreenId
      )
      Toast.showSuccess('toast.success')
      toggle('SAVED')
    } catch (error) {
      if (error.httpStatusCode === 403) {
        handleError403(error.config.url)
      } else {
        Toast.showError('toast.error', getErrorMessage(error))
      }
    }
  }

  return (
    <div
      className={classnames('right-slidebar', {
        show: open && !!scheduleDetails
      })}
    >
      {!!scheduleDetails && !!occurrence && (
        <>
          <div className='right-slidebar-content'>
            <div className='right-slidebar-header px-2 pt-1 pb-0 position-relative'>
              <div className='d-flex align-items-center ml-0 mb-50'>
                <h6 className='text-secondary mb-0 mr-auto '>
                  <FormattedMessage id='label.doctor' defaultMessage='Doctor' />
                </h6>
                <Can I='write' a='doctorSchedules'>
                  <UncontrolledButtonDropdown className='slide-bar-header-btn' size='sm'>
                    <DropdownToggle outline color='primary' caret className='bg-white'>
                      <FormattedMessage id='button.actions' defaultMessage='Actions' />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        tag='a'
                        onClick={openEditModal}
                        disabled={occurrence.startTime < startOfDay(new Date())}
                      >
                        <Edit className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.edit' defaultMessage='Edit' />
                        </span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        onClick={handleDelete}
                        disabled={occurrence.startTime < startOfDay(new Date())}
                      >
                        <Trash className='mr-50' size={15} />
                        <span className='align-middle'>
                          <FormattedMessage id='button.delete' defaultMessage='Delete' />
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </Can>

                <X className='cursor-pointer' size={25} onClick={toggle} />
              </div>

              <AvatarWrapper
                imgUrl={scheduleDetails.doctor.avatar?.fileUrl}
                title={scheduleDetails.doctor.doctorName}
                subTitle={`${format(occurrence.startTime, 'dd/MM/yyyy')} - ${scheduleDetails.locationName}`}
                size='lg'
              />

              <ScrollNav activeTab={activeTab} toggleTab={toggleTab} navItems={navItems} />
            </div>
            <ModalBody>
              <TabContent className='py-50' activeTab={activeTab}>
                <TabPane tabId='0'>
                  <OverviewTab scheduleDetails={scheduleDetails} />
                </TabPane>
                <TabPane tabId='1'>
                  <AppointmentsTab slots={appointmentSlots} />
                </TabPane>
              </TabContent>
            </ModalBody>
          </div>
        </>
      )}
    </div>
  )
}

export default RightSlidebarSchedule
