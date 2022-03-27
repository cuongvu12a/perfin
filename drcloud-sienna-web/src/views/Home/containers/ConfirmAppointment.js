import React from 'react';
import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import _ from 'lodash';

import { createAppointment } from '@api/main';
import { BookingStepId } from '@utils/constants';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';

const ConfirmAppointment = ({
  data,
  setCurrentStep
}) => {
  const listData = [
    {
      title: 'Phòng khám:',
      content: data.clinic.clinicName
    },
    {
      title: 'Địa chỉ:',
      content: data.clinic.address
    },
    {
      title: 'Chuyên khoa:',
      content: data.specialty
    },
    {
      title: 'Thời gian khám:',
      content: moment(data.startDatetimeUnix).format('HH:mm - DD/MM/YYY')
    },
    {
      title: 'Bác sĩ khám:',
      content: data.doctorName
    },
    {
      title: 'divider',
      isDivider: true
    },
    {
      title: 'Bệnh nhân:',
      content: data.patient.fullName
    },
    {
      title: 'Năm sinh:',
      content: moment(data.patient.birthdayUnix).format('DD/MM/YYY')
    },
    {
      title: 'Triệu chứng:',
      content: data.symptom
    }
  ];

  const nextStep = async () => {
    const payload = _.pick(data, [
      'patientId',
      'clinicId',
      'locationId',
      'doctorId',
      'scheduleId',
      'startDatetimeUnix',
      'symptom'
    ]);
    const result = await createAppointment(payload);
    if (!result?.metadata || !result?.metadata.success) return;
    setCurrentStep(BookingStepId.success);
  };

  return (
    <NextStepLayoutWrapper headerContent="Xác nhận lịch khám" nextContent="Đặt lịch" nextStep={nextStep} isNextStep>
      <Grid container flexDirection="column" padding="1rem" rowGap="1rem">
        {listData?.map((el) => (
          <Grid key={el.title} item borderBottom={el.isDivider && '1px solid'} borderColor="divider.main">
            {!el.isDivider && el.content && (
              <Typography display="flex" width="100%" variant="h5" color="textPrimary.main">
                {el.title}
                &nbsp;
                <Typography fontWeight="700">{el.content}</Typography>
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>
    </NextStepLayoutWrapper>
  );
};

export default ConfirmAppointment;
