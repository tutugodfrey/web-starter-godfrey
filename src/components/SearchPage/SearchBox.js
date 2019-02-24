import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    borderRadius: 100,
  },
  input: {
    marginLeft: 2,
    size: 10,
    fontSize: '0.7em',
    height: '33px',
    width: '80%',
  },
  iconButton: {
    paddingRight: 5,
    height: '33px',
    position: 'relative',
    top: '-4px'
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
