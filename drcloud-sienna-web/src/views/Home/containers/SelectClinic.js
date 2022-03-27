import React, { useState, useEffect } from 'react';
import useGeolocation from 'react-hook-geolocation';
import { Box, FormControl, RadioGroup, Typography } from '@mui/material';
import { useDebounce } from 'use-debounce';
import * as _ from 'lodash';

import { BookingStepId } from '@utils/constants';
import { searchClinics } from '@api/main';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';
import { InputSearch } from '@components/Input';
import RadioSelect from '@components/RadioSelect';

const SelectClinic = ({ setData, setCurrentStep }) => {
  const { latitude, longitude } = useGeolocation();
  const [keyword, setKeyword] = useState('');
  const [value] = useDebounce(keyword, 300);
  const [clinics, setClinics] = useState(null);
  const [clinicId, setClinicId] = useState('');

  useEffect(async () => {
    const result = await searchClinics({ keyword, latitude, longitude });
    if (!result?.metadata || !result?.metadata.success) return;
    setClinics(result.data);
  }, [value, latitude, longitude]);

  const handleChange = (e) => {
    setClinicId(e.target.value);
  };

  const nextStep = () => {
    if (!clinicId) return;
    const clinicSelected = clinics.find((el) => el.locationId === clinicId);
    const clinic = _.pick(clinicSelected, ['clinicId', 'locationId', 'logo', 'clinicName', 'address']);
    setData((currentValue) => ({ ...currentValue, clinicId: clinic.clinicId, locationId: clinic.locationId, clinic }));
    setCurrentStep(BookingStepId.selectPatient);
  };

  return (
    <NextStepLayoutWrapper
      headerContent="Chọn phòng khám"
      prevStep={() => setCurrentStep(BookingStepId.welcome)}
      nextStep={nextStep}
      isNextStep={!!clinicId}
    >
      <>
        <Box padding="1rem" borderBottom="1px solid" borderColor="divider.main">
          <InputSearch
            name="keyword"
            placeholder="Tìm kiếm phòng khám"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            hasIconInner
          />
        </Box>
        <FormControl>
          <RadioGroup name="clinicId" value={clinicId} onChange={handleChange}>
            {clinics?.length > 0 && clinics.map((el) => (
              <RadioSelect key={el.locationId} value={el} filedValue="locationId" currentShow="clinic" />
            ))}
            {clinics?.length === 0 && (
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
                  Không tìm thấy phòng khám nào
                </Typography>
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </>
    </NextStepLayoutWrapper>
  );
};

export default SelectClinic;
