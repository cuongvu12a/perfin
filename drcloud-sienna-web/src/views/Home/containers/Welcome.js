import React, { useEffect, useState } from 'react';
import { Typography, Grid, Container, Link } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

import { STORAGE_KEYS, Storage } from '@utils/storage';
import { BookingStepId } from '@utils/constants';
import { authLoginToken } from '@api/main';
import Logo from '@components/icons/Logo';
import Button from '@components/Button';

const Welcome = ({ setData, setCurrentStep }) => {
  const [isLogin, setIsLogin] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(async () => {
    const loginToken = searchParams.get('loginToken');
    if (!loginToken) return;
    const result = await authLoginToken(loginToken);
    if (!result?.metadata || !result?.metadata.success) return;
    const { token, user } = result.data;
    Storage.setItem(STORAGE_KEYS.token, token);
    Storage.setItem(STORAGE_KEYS.userData, user);
    setIsLogin(true);
  }, [searchParams]);

  const nextStep = () => {
    setData({});
    setCurrentStep(BookingStepId.selectClinic);
  };

  return (
    <Container>
      <Grid container direction="column" paddingTop="2.75rem" paddingX="1rem">
        <Logo marginBottom="2rem" display="inline-block" textAlign="center" />
        <Typography variant="h2" marginBottom="6px" color="textPrimary.main">
          Phòng khám 4.0
        </Typography>
        <Typography variant="h5" lineHeight="30px" color="textPrimary.main">
          Dr. Cloud hỗ trợ đặt lịch khám đa nền tảng một cách thuận tiện nhất, tối ưu nhất
        </Typography>
        <Link href="#" variant="h5" color="primary" underline="hover" width="max-content">
          Tìm hiểu về Dr. Cloud
        </Link>
        <Button
          disabled={!isLogin}
          marginTop="2rem"
          paddingY="10px"
          content="Đặt lịch khám"
          handleClick={nextStep}
          innerIcon={<ArrowForwardIos className="icon-next" />}
        />
      </Grid>
    </Container>
  );
};

export default Welcome;
