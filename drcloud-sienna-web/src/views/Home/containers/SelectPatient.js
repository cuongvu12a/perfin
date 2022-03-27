import React, { useState } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

import { BookingStepId, createPatient } from '@utils/constants';
import { getPatients } from '@api/main';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';
import RadioSelect from '@components/RadioSelect';
import useInfiniteScrolling from '@hook/useInfiniteScrolling';
import * as _ from 'lodash';

const SelectPatient = ({ setData, setCurrentStep }) => {
  const [patientId, setPatientId] = useState('');

  const handleChange = (e) => {
    setPatientId(e.target.value);
  };

  const queryFunc = ({ pageNumber }) => {
    return getPatients({ pageNumber, pageSize: 20 });
  };
  const dependency = [];

  const { data: patients, isLoading, isError, lastElementRef } = useInfiniteScrolling({ queryFunc, dependency });

  const nextStep = () => {
    if (!patientId) return;
    const nextId = patientId === createPatient ? BookingStepId.createPatient : BookingStepId.createAppointment;
    const patientSelected = patients.find((el) => el.patientId === patientId);
    console.log(patientSelected);
    const patient = _.pick(patientSelected, ['patientId', 'fullName', 'birthdayUnix']);
    setData((currentValue) => ({ ...currentValue, patientId, patient }));
    setCurrentStep(nextId);
  };

  return (
    <NextStepLayoutWrapper
      headerContent="Chọn hồ sơ khám"
      prevStep={() => setCurrentStep(BookingStepId.selectClinic)}
      nextStep={nextStep}
      isNextStep={!!patientId}
    >
      <FormControl>
        <RadioGroup name="patientId" value={patientId} onChange={handleChange}>
          <>
            {!isLoading && !isError && (
              <>
                {patients?.length > 0 && patients.map((el, index) => (
                  <div key={el.patientId} ref={index === patients.length - 1 ? lastElementRef : null}>
                    <RadioSelect value={el} filedValue="patientId" currentShow="patient" />
                  </div>
                ))}
                {patients?.length === 0 && (
                  <Box padding="1rem" borderBottom="1px solid" borderColor="divider.main">
                    <Typography
                      display="flex"
                      paddingY="1rem"
                      bgcolor="divider.main"
                      justifyContent="center"
                      alignItems="center"
                      variant="h3"
                      fontWeight="500"
                      color="grey.700"
                    >
                      Bạn chưa có hồ sơ nào
                    </Typography>
                  </Box>
                )}
              </>
            )}
            <Box padding="0.5rem" borderBottom="1px solid" borderColor="divider.main">
              <Typography variant="button" color="textPrimary.main">
                Hoặc
              </Typography>
            </Box>
            <Box paddingX="1rem" paddingY="0.5rem" borderBottom="1px solid" borderColor="divider.main">
              <FormControlLabel
                value={createPatient}
                control={<Radio color="secondary" />}
                label={
                  <Typography color="textSecondary.main" variant="h3">
                    Tạo hồ sơ mới
                  </Typography>
                }
                style={{ width: '100%' }}
              />
            </Box>
          </>
        </RadioGroup>
      </FormControl>
    </NextStepLayoutWrapper>
  );
};

export default SelectPatient;
