import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    borderRadius: 100,
    width: '100%',
    fontSize: '0.6em',
  },
  input: {
    marginLeft: 2,
    size: 10,
    height: '33px',
    width: '73%',
  },
  iconButton: {
    height: '30px',
    position: 'relative',
    top: '-8px',
    left: '4px',
    width: '15%',
  },
};

const SearchBox = (props) => {
  const {
    classes,
    getLocation,
    areaToSearch,
    handleChange
  } = props;

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="Search">
        <SearchIcon onClick={getLocation} id="search-icon" />
      </IconButton>
      <InputBase
        className={classes.input}
        onKeyPress={getLocation}
        onChange={handleChange}
        id="search-box"
        placeholder="Search food in your area..."
        value={areaToSearch}
      />
    </Paper>
  );
};

export default withStyles(styles)(SearchBox);
