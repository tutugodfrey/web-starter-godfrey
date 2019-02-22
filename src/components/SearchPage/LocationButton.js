import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Place from '@material-ui/icons/Place';


const styles = (theme) => ({
  button: {
    borderRadius: 100,
    height: '35px',
    fontSize: '0.7em',
    backgroundImage: 'linear-gradient(to right, #FFB300, #FF9900)',
  },
  place: {
    paddingRight: '3px'
  }
});

const LocationButton = (props) => {
  const { classes, handleUseMyLocation } = props;
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={handleUseMyLocation}
    >
      <Place className={classes.place} />
      User my location
    </Button>
  );
};

export default withStyles(styles)(LocationButton);
