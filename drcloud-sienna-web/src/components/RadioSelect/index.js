import React from 'react';
import PropTypes from 'prop-types';
import { Box, Radio, FormControlLabel, Grid, Typography, Avatar } from '@mui/material';
import moment from 'moment';

import { reverseEnumObject, handleShowPrice } from '@utils/common';
import { GenderEnum, CurrencyUnitEnum } from '@utils/constants';

const RadioSelect = ({ currentShow, value, filedValue }) => {
  return (
    <>
      <Box paddingX="1rem" paddingY="0.5rem" borderBottom="1px solid" borderColor="divider.main">
        <FormControlLabel
          value={value[filedValue]}
          control={<Radio color="secondary" />}
          label={
            <>
              {currentShow === 'clinic' && <ClinicItem clinic={value} />}
              {currentShow === 'patient' && <PatientItem patient={value} />}
            </>
          }
          style={{ width: '100%' }}
        />
      </Box>
    </>
  );
};

RadioSelect.propTypes = {
  currentShow: PropTypes.oneOf(['clinic', 'patient']),
  value: PropTypes.object.isRequired,
  filedValue: PropTypes.string.isRequired
};

const ClinicItem = ({ clinic }) => {
  return (
    <>
      <Grid container flexDirection="column" rowGap="10px">
        <Grid item>
          <Typography variant="h4">{clinic?.clinicName}</Typography>
        </Grid>
        <Grid container columnGap="12px">
          <Grid item>
            <Avatar sx={{ width: 48, height: 48 }} src={clinic?.logo?.fileUrl} alt={clinic?.clinicName} />
          </Grid>
          <Grid item>
            <Grid container flexDirection="column">
              <Typography variant="p">{clinic?.address}</Typography>
              <Typography color="secondary" variant="h6">
                {`${handleShowPrice(clinic?.minPriceInVnd, CurrencyUnitEnum.VND)} - ${handleShowPrice(clinic?.maxPriceInVnd, CurrencyUnitEnum.VND)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const PatientItem = ({ patient }) => {
  return (
    <>
      <Grid container columnGap="12px">
        <Grid item>
          <Avatar sx={{ width: 48, height: 48 }} src={patient?.avatar?.fileUrl} alt={patient?.fullName} />
        </Grid>
        <Grid item>
          <Grid container flexDirection="column">
            <Typography variant="h3">{patient?.fullName}</Typography>
            <Typography color="grey.700" variant="h6">
              {`${reverseEnumObject(GenderEnum)[patient?.gender]} - ${moment(patient?.birthdayUnix).format('DD/MM/YYYY')}`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RadioSelect;
