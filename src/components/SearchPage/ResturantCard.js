import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grade from '@material-ui/icons/Grade';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import Place from '@material-ui/icons/Place';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  card: {
    display: 'flex',
    'border-radius': '5px',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flex: '1 0 auto',
    padding: '15px',
  },
  cover: {
    width: 151,
  },
  primary: {
    color: '#65a9f3',
  },
  addressGrade: {
    marginTop: '15px',
    position: 'relative',
    top: '5px',
    right: '3px',
  },
  titleTypograph: {
    display: 'inline',
    position: 'relative',
    top: '-5px',
    left: '3px',
  },
  link: {
    textDecoration: 'none',
    position: 'relative',
  }
});

const ResturantCard = (props) => {
  const { classes } = props;
  const { restDetails, formatText } = props;
  const image = restDetails.images;
  let { distance, title, address } = restDetails;
  let addressCursor = 'default';
  if (title.length > 20) {
    title = `${title.substr(0, 20)}...`;
  }

  if (address.length > 35) {
    address = `${address.substr(0, 35)}...`;
    addressCursor = 'pointer';
  }
  distance = distance ? distance.toPrecision(3) : distance;
  return (
    <div variant="contained" className={`${classes.content}`}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Link className={classes.link} to={`rest/${restDetails.id}`}>
            <Place color="primary" />
            <Typography
              variant="title"
              color="textSecondary"
              onMouseDown={
                (event) => formatText(event, restDetails, 'title')}
              className={classes.titleTypograph}
            >
              {title}
            </Typography>
          </Link>
          <Typography variant="subtitle3" color="textPrimary">
            {restDetails.cuisine}
          </Typography>
          <Fragment>
            <Grade color="textSecondary" className={classes.addressGrade} />
            <Typography
              component="p"
              color="textSecondary"
              style={{display: 'inline', cursor: addressCursor}}
              onMouseDown={
                (event) => formatText(event, restDetails, 'address')}
            >
              {address}
            </Typography>
          </Fragment>

        </CardContent>
        <CardMedia
          className={`${classes.cover} ${classes.details}`}
          image={image ? image[0] : 'default.jpg'}
          p={1}
        />
      </Card>
      <span className={`${classes.primary}`} style={{marginRight: '5px'}}>{restDetails.open_closed}</span>
      <span className={`${classes.primary}`} style={{marginRight: '5px'}}>
        *
      </span>
      <span className={` ${classes.primary}`} style={{marginRight: '5px'}}>{distance} miles away</span>
      <span style={{marginRight: '5px'}}><DirectionsWalk color="primary" />10min</span>
      <span style={{marginRight: '5px'}}><Grade color="primary" /> {restDetails.rating}</span>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ResturantCard);
