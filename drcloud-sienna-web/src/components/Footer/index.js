import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button, Typography, Box } from '@mui/material';
import { ArrowForwardIos, ArrowBackIosNew } from '@mui/icons-material';

const Footer = ({ isNextStep, nextContent, prevContent, nextStep, prevStep }) => {
  return (
    <FooterWrapper component="div" color="white" prevStep={prevStep}>
      {prevStep ? (
        <>
          <Button onClick={prevStep} color="white" variant="text">
            <ArrowBackIosNew />
            <Typography variant="buttonStep">{prevContent}</Typography>
          </Button>
          <Button disabled={!isNextStep} onClick={nextStep} variant="text" color="white">
            <Typography variant="buttonStep">{nextContent}</Typography>
            <ArrowForwardIos />
          </Button>
        </>
      ) : (
        <>
          <Button disabled={!isNextStep} onClick={nextStep} color="white" variant="text">
            <Typography variant="button">{nextContent}</Typography>
          </Button>
        </>
      )}
    </FooterWrapper>
  );
};

const FooterWrapper = styled(Box)(
  ({ theme, prevStep }) => `
  display: flex;
  align-items: center;
  justify-content: ${prevStep ? 'space-between' : 'center'};
  min-height: 83px;
  background-color: ${theme.palette.primary.main};
`
);

Footer.propTypes = {
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func,
  nextContent: PropTypes.string,
  prevContent: PropTypes.string,
  isNextStep: PropTypes.bool
};

Footer.defaultProps = {
  nextContent: 'Tiếp tục',
  prevContent: 'Quay lại',
  isNextStep: false
};

export default Footer;
