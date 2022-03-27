import React, { useEffect, useState } from 'react';
import {
  Grid,
  Avatar,
  Typography,
  FormControl,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormHelperText,
  styled,
  CircularProgress
} from '@mui/material';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from 'lodash';
import moment from 'moment';

import { getClinicInfo, getDoctorSchedule } from '@api/main';
import { BookingStepId, SpecialtyDefault } from '@utils/constants';
import NextStepLayoutWrapper from '@components/NextStepLayoutWrapper';
import { FormSelect, FormInputText, FormDatePicker } from '@components/Input';

const defaultValues = {
  specialty: SpecialtyDefault.specialtyId,
  dateSchedule: moment()
};

const createAppointmentSchema = yup.object().shape({
  specialty: yup.string().required().trim(),
  symptom: yup.string().max(128).trim(),
  doctorId: yup.string().required().trim(),
  dateSchedule: yup.date().required(),
  startDatetimeUnix: yup.number().required()
});

const CreateAppointment = ({ data, setData, setCurrentStep }) => {
  const { clinic } = data;
  const [clinicInfo, setClinicInfo] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [dateSchedules, setDateSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const methods = useForm({
    resolver: yupResolver(createAppointmentSchema),
    defaultValues
  });
  const { handleSubmit, control, watch, getValues, setValue } = methods;

  const onSubmit = async (value) => {
    const specialty = [SpecialtyDefault, ...(clinicInfo?.specialties || [])].find(
      (el) => el.specialtyId === value.specialty
    )?.specialtyName;
    const doctorName = doctors.find((el) => el.doctorId === value.doctorId)?.doctorName;
    const scheduleId = dateSchedules.find((el) => moment(el?.occurrenceStartUnix).isSame(watch('dateSchedule'), 'day'))?.scheduleId;
    const currentValue = _.pick(value, ['doctorId', 'symptom', 'startDatetimeUnix']);
    setData((currentData) => ({
      ...currentData,
      ...currentValue,
      specialty,
      doctorName,
      scheduleId
    }));
    setCurrentStep(BookingStepId.confirmAppointment);
  };

  useEffect(async () => {
    if (!clinic?.clinicId) return;
    const result = await getClinicInfo(clinic?.clinicId);
    if (!result?.metadata || !result?.metadata.success) return;
    setClinicInfo(result.data);
    setDoctors(result.data?.doctors);
  }, [clinic?.clinicId]);

  useEffect(async () => {
    if (getValues('specialty') === SpecialtyDefault.specialtyId) {
      setDoctors(clinicInfo?.doctors);
    } else {
      const listDoctor = (clinicInfo?.doctors || []).filter((el) => {
        return getValues('specialty') === el.specialtyId;
      });
      setDoctors(listDoctor);
    }
  }, [watch('specialty')]);

  useEffect(async () => {
    setSchedules(null);
    if (!getValues('doctorId')) return;
    const result = await getDoctorSchedule(clinic?.clinicId, {
      doctorId: getValues('doctorId'),
      locationId: clinic.locationId
    });
    if (!result?.metadata || !result?.metadata.success) return;
    setDateSchedules(result.data);
  }, [watch('doctorId')]);

  useEffect(async () => {
    if (!getValues('dateSchedule') || dateSchedules.length === 0) return;
    const currentSchedule = dateSchedules.find((el) => moment(el?.occurrenceStartUnix).isSame(getValues('dateSchedule'), 'day'));
    if (!currentSchedule) return;
    setSchedules(currentSchedule);
  }, [watch('dateSchedule'), dateSchedules]);

  useEffect(() => {
    if (!doctors) return;
    const index = doctors.findIndex((el) => el?.doctorId === getValues('doctorId'));
    if (index !== -1) return;
    setValue('doctorId', doctors[0]?.doctorId);
  }, [doctors]);

  return (
    <NextStepLayoutWrapper
      headerContent="Đặt lịch khám"
      prevStep={() => setCurrentStep(BookingStepId.selectPatient)}
      nextStep={handleSubmit(onSubmit)}
      isNextStep
    >
      <FormProvider>
        <Grid container flexDirection="column">
          <Grid items paddingX="1rem" paddingY="0.5rem" borderBottom="1px solid" borderColor="divider.main">
            <Grid container columnGap="12px">
              <Grid item>
                <Avatar sx={{ width: 48, height: 48 }} src={clinic?.logo?.fileUrl} alt={clinic?.clinicName} />
              </Grid>
              <Grid item>
                <Grid container flexDirection="column">
                  <Typography variant="h3">{clinic?.clinicName}</Typography>
                  <Typography color="grey.700" variant="h6" fontWeight="600">
                    {clinic?.address}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Form */}
          <Grid item>
            <Grid container flexDirection="column" rowGap="1rem" paddingX="1rem" paddingTop="1rem">
              <Grid item>
                <FormSelect
                  name="specialty"
                  label="Chọn chuyên khoa"
                  control={control}
                  options={[SpecialtyDefault, ...(clinicInfo?.specialties || [])]}
                  genderLabel={(el) => el.specialtyName}
                  genderValue={(el) => el.specialtyId}
                  isRequired
                  hasBorder
                />
              </Grid>
              <Grid item>
                <FormInputText
                  name="symptom"
                  label="Triệu chứng"
                  placeholder="Nhập triệu chứng của bạn"
                  control={control}
                />
              </Grid>
              <Grid item>
                <FormSelect
                  name="doctorId"
                  label="Chọn bác sĩ"
                  control={control}
                  options={doctors}
                  genderLabel={(el) => el.doctorName}
                  genderValue={(el) => el.doctorId}
                  isRequired
                  hasBorder
                />
              </Grid>
              <Grid item>
                <FormDatePicker
                  name="dateSchedule"
                  label="Chọn ngày khám"
                  control={control}
                  isRequired
                  minDate={moment(dateSchedules[0]?.occurrenceStartUnix)}
                  maxDate={moment(dateSchedules[dateSchedules?.length - 1]?.occurrenceStartUnix)}
                  hasBorder
                />
              </Grid>
              <Grid item>
                {watch('doctorId') && dateSchedules.length > 0 && schedules === null && (
                  <CircularProgress
                    style={{
                      display: 'block',
                      margin: '20px auto'
                    }}
                  />
                )}
                <Controller
                  name="startDatetimeUnix"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl required style={{ width: '100%' }} error={error}>
                      <RadioGroup onChange={onChange} value={value} style={{ display: 'flex', rowGap: '1rem', columnGap: '12px', flexDirection: 'row' }}>
                        {schedules?.slots?.length > 0 && schedules?.slots?.map((el) => (
                          <FormControlLabelSchedule key={el} value={el} label={moment(el).format('HH:mm')} control={<Radio />} />
                        ))}
                      </RadioGroup>
                      <FormHelperText>{error ? error.message : ''}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </NextStepLayoutWrapper>
  );
};

const FormControlLabelSchedule = styled(FormControlLabel)(
  ({ theme }) => `
  width: calc(33.33% - 8px);
  margin: 0;
  .MuiRadio-root{
    display: none;
  }
  .MuiTypography-root {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${theme.palette.textPrimary.main};
    color: ${theme.palette.textPrimary.main};
  }
  .Mui-checked + .MuiTypography-root{
    border-color: transparent;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.white.main};
  }
`
);

export default CreateAppointment;
