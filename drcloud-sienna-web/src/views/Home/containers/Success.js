import React from 'react';
import { Typography, Grid, Container, Link } from '@mui/material';

import { BookingStepId } from '@utils/constants';
import SuccessIcon from '@components/icons/Success';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';

const Success = ({ setCurrentStep }) => {
  return (
    <NextStepLayoutWrapper
      hasHeader={false}
      nextContent="Quay về trang chủ"
      nextStep={() => setCurrentStep(BookingStepId.welcome)}
      isNextStep
    >
      <Container>
        <Grid container direction="column" paddingTop="2.75rem" paddingX="1rem">
          <SuccessIcon marginBottom="4rem" display="inline-block" textAlign="center" />
          <Typography variant="h2" marginBottom="6px">
            Đặt lịch thành công
          </Typography>
          <Typography variant="h5" lineHeight="30px">
            Lịch hẹn đã được gửi đến phòng khám.
          </Typography>
          <Typography variant="h5">
            <Link href="#" color="primary" underline="hover">
              Tải ứng dụng Dr. Cloud
            </Link>
            &nbsp;để xem chi tiết
          </Typography>
        </Grid>
      </Container>
    </NextStepLayoutWrapper>
  );
};

export default Success;
