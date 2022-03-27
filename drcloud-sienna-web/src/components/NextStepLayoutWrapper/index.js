import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';

import Footer from '@components/Footer';

function NextStepLayoutWrapper({ children, isInnerHeight = true, hasHeader = true, headerContent, ...rest }) {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flex="1" style={isInnerHeight ? { overflowY: 'scroll' } : {}}>
        <Grid container direction="column">
          {hasHeader && (
            <Box padding="1rem" borderBottom="1px solid" borderColor="divider.main">
              <Typography variant="button" color="textPrimary.main">
                {headerContent}
              </Typography>
            </Box>
          )}
          {children}
        </Grid>
      </Box>
      <Footer {...rest} />
    </Box>
  );
}

NextStepLayoutWrapper.propTypes = {
  isInnerHeight: PropTypes.bool,
  hasHeader: PropTypes.bool,
  headerContent: PropTypes.string,
  children: PropTypes.element.isRequired
};

export default NextStepLayoutWrapper;
