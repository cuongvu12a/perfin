import React from 'react';
import { Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from 'lodash';
import moment from 'moment';

import { createPatient } from '@api/main';
import { GenderEnum, CountryEnum, phoneRegExp, BookingStepId } from '@utils/constants';
import { enumToSelectOptions } from '@utils/common';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';
import { FormInputText, FormDatePicker, FormSelect } from '@components/Input';

const defaultValues = {
  gender: GenderEnum.Nam,
  birthdayUnix: moment('1990-01-01'),
  countryId: CountryEnum['Việt Nam']
};

const createPatientSchema = yup.object().shape({
  fullName: yup.string().required().max(128).trim(),
  birthdayUnix: yup.date().required(),
  phoneNumber: yup.string().required().matches(phoneRegExp, 'Số điện thoại không đúng định dạng'),
  email: yup.string().email(),
  address: yup.string().required().max(128).trim(),
  gender: yup.number().required(),
  heightInCm: yup.number().min(0),
  weightInKg: yup.number().min(0),
  medicalHistory: yup.string().trim(),
  allergy: yup.string().trim()
});

const CreatePatient = ({ setData, setCurrentStep }) => {
  const methods = useForm({
    resolver: yupResolver(createPatientSchema),
    defaultValues
  });
  const { handleSubmit, control } = methods;
  const onSubmit = async (data) => {
    const result = await createPatient({
      ...data,
      birthdayUnix: moment(data.birthdayUnix).unix()
    });
    if (!result?.metadata || !result?.metadata.success) return;
    const patient = _.pick(result.data, ['patientId', 'fullName', 'birthdayUnix']);
    setData((currentValue) => ({ ...currentValue, patientId: patient.patientId, patient }));
    setCurrentStep(BookingStepId.createAppointment);
  };

  return (
    <NextStepLayoutWrapper
      headerContent="Tạo hồ sơ mới"
      prevStep={() => setCurrentStep(BookingStepId.selectPatient)}
      nextStep={handleSubmit(onSubmit)}
      isNextStep
    >
      <FormProvider>
        <Grid container flexDirection="row" padding="1rem" rowGap="12px" columnGap="8px">
          <Grid item width="100%">
            <FormInputText name="fullName" label="Họ và tên" placeholder="Họ và tên" control={control} isRequired />
          </Grid>
          <Grid item width="100%">
            <FormDatePicker name="birthdayUnix" label="Ngày sinh" control={control} isRequired maxDate={moment()} />
          </Grid>
          <Grid item width="calc(30% - 4px)">
            <FormSelect
              name="gender"
              label="Giới tính"
              control={control}
              options={enumToSelectOptions(GenderEnum)}
              isRequired
            />
          </Grid>
          <Grid item width="calc(70% - 4px)">
            <FormInputText
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              isRequired
            />
          </Grid>
          <Grid item width="100%">
            <FormInputText name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} isRequired />
          </Grid>
          <Grid item width="100%">
            <FormSelect
              name="countryId"
              label="Quốc tịch"
              control={control}
              options={enumToSelectOptions(CountryEnum)}
              isRequired
            />
          </Grid>
          <Grid item width="100%">
            <FormInputText name="email" label="Email" placeholder="Nhập email" control={control} />
          </Grid>
          <Grid item width="100%">
            <FormInputText name="heightInCm" label="Chiều cao (cm)" placeholder="Nhập chiều cao" control={control} />
          </Grid>
          <Grid item width="100%">
            <FormInputText name="weightInKg" label="Cân nặng (kg)" placeholder="Nhập cân nặng" control={control} />
          </Grid>
          <Grid item width="100%">
            <FormInputText
              name="medicalHistory"
              label="Lịch sử bệnh lý"
              placeholder="Nhập lịch sử bênh lý"
              control={control}
            />
          </Grid>
          <Grid item width="100%">
            <FormInputText name="allergy" label="Dị ứng" placeholder="Nhập dị ứng cá nhân" control={control} />
          </Grid>
        </Grid>
      </FormProvider>
    </NextStepLayoutWrapper>
  );
};

export default CreatePatient;
