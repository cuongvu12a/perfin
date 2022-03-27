import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton, Typography, Box, styled } from '@mui/material';

const Button = ({ content, handleClick, color, innerIcon, ...rest }) => {
  return (
    <ButtonWrapper
      component={MuiButton}
      variant="contained"
      color={color}
      onClick={handleClick}
      {...rest}
      position="relative"
    >
      <Typography variant="button">{content}</Typography>
      {innerIcon && innerIcon}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled(Box)`
  .icon-next {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

Button.propTypes = {
  content: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf(['primary']),
  innerIcon: PropTypes.element,
  rest: PropTypes.any
};

Button.defaultProps = {
  color: 'primary'
};

export default Button;
