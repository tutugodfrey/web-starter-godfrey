import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
  root: {
    padding: '2px 2px',
    display: 'flex',
    alignItems: 'center',
    width: 225,
    borderRadius: 100,
  },
  input: {
    marginLeft: 2,
    flex: 1,
    size: 10,
  },
  iconButton: {
    padding: 5,
  },
};

const SearchBox = (props) => {
  const { classes, getLocation, areaToSearch, handleChange } = props;

  return (
    <Paper className={classes.root} elevation={1}>
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
