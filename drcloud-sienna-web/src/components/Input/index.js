import React from 'react';
import {
  TextField,
  styled,
  InputAdornment,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { Search } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

export const InputSearch = ({ name, placeholder, value, onChange, iconInner, hasIconInner, ...rest }) => {
  return (
    <InputWrapper>
      <TextField
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        InputProps={{
          startAdornment: <>{hasIconInner && <InputAdornment position="start">{iconInner}</InputAdornment>}</>
        }}
        {...rest}
      />
    </InputWrapper>
  );
};

InputSearch.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasIconInner: PropTypes.bool,
  iconInner: PropTypes.element
};

InputSearch.defaultProps = {
  hasIconInner: false,
  iconInner: <Search />
};

export const FormInputText = ({ name, control, label, placeholder, isRequired, hasBorder }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControlWrapper required={isRequired} style={{ width: '100%' }} error={error}>
          <FormLabel>{label}</FormLabel>
          <InputWrapper hasBorder={hasBorder}>
            <TextField onChange={onChange} value={value} fullWidth placeholder={placeholder} />
          </InputWrapper>
          <FormHelperText>{error ? error.message : ''}</FormHelperText>
        </FormControlWrapper>
      )}
    />
  );
};

FormInputText.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  control: PropTypes.any.isRequired,
  placeholder: PropTypes.string.isRequired,
  hasBorder: PropTypes.bool
};

FormInputText.defaultProps = {
  isRequired: false,
  hasBorder: false,
};

export const FormDatePicker = ({ name, control, label, isRequired, hasBorder, maxDate, minDate }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControlWrapper required={isRequired} style={{ width: '100%' }} error={error}>
          <FormLabel>{label}</FormLabel>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              maxDate={maxDate}
              minDate={minDate}
              onChange={onChange}
              value={value}
              inputFormat="DD/MM/YYYY"
              renderInput={(params) => (
                <InputWrapper hasBorder={hasBorder}>
                  <TextField fullWidth {...params} />
                </InputWrapper>
              )}
            />
          </LocalizationProvider>
          <FormHelperText>{error ? error.message : ''}</FormHelperText>
        </FormControlWrapper>
      )}
    />
  );
};

FormDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  control: PropTypes.any.isRequired,
  hasBorder: PropTypes.bool,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
};

FormDatePicker.defaultProps = {
  isRequired: false,
  hasBorder: false,
};

export const FormSelect = ({ name, control, label, isRequired, options, genderValue, genderLabel, hasBorder }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControlWrapper required={isRequired} style={{ width: '100%' }} error={error}>
          <FormLabel>{label}</FormLabel>
          <InputWrapper hasBorder={hasBorder}>
            <Select onChange={onChange} value={value} fullWidth>
              {options?.length > 0 && options.map((el) => (
                <MenuItem key={genderValue(el)} value={genderValue(el)}>
                  {genderLabel(el)}
                </MenuItem>
              ))}
            </Select>
          </InputWrapper>
          <FormHelperText>{error ? error.message : ''}</FormHelperText>
        </FormControlWrapper>
      )}
    />
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  control: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  genderValue: PropTypes.func,
  genderLabel: PropTypes.func,
  hasBorder: PropTypes.bool
};

FormSelect.defaultProps = {
  isRequired: false,
  genderValue: (el) => el.value,
  genderLabel: (el) => el.label,
  hasBorder: false,
};

export const FormControlWrapper = styled(FormControl)(
  ({ theme, error }) => `
  .MuiFormLabel-root{
    color: ${theme.palette.grey['700']} !important;
  }
  .MuiFormHelperText-root,.MuiFormLabel-asterisk{
    color: ${theme.palette.textSecondary.main};
  }
  .MuiBox-root{
    ${error && `border: 1px solid ${theme.palette.textSecondary.main};`}
  }
`
);

export const InputWrapper = styled(Box)(
  ({ theme, hasBorder }) => `
  border-radius: 1rem;
  border: ${hasBorder && `1px solid ${theme.palette.grey[700]}`};
  background: ${!hasBorder && theme.palette.divider.main};
  .MuiOutlinedInput-root{
    height: 3rem; 
  }
  .MuiOutlinedInput-notchedOutline{
    border: none;
  }
`
);

export default {};
