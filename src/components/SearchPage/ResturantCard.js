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
  content: {
    flex: '1 0 auto',
    padding: '15px',
  },
  card: {
    display: 'flex',
    'border-radius': '5px',
  },
  cardContent: {
    flex: '1 0 auto',
    padding: '15px',
    width: '65%',
  },
  cardMedia: {
    display: 'flex',
    flexDirection: 'row',
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
  titleStyle: {
    display: 'block',
    fontSize: '1em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  pTitle: {
    display: 'inline',
    position: 'relative',
    top: '-7px',
  },
  link: {
    textDecoration: 'none',
    position: 'relative',
  },
  paperStyle: {
    background: 'transparent',
    square: false,
    paddingTop: '3px',
  },
  addressStyle: {
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
});

const ResturantCard = (props) => {
  const { classes } = props;
  const { restDetails } = props;
  const image = restDetails.images;
  const { title, address } = restDetails;
  let { distance } = restDetails;

  distance = distance ? distance.toPrecision(3) : distance;
  return (
    <div variant="contained" className={`${classes.content}`}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Link className={classes.link} to={`rest/${restDetails.id}`}>
            <Typography
              variant="title"
              color="textSecondary"
              className={classes.titleStyle}
            >
              <Place color="primary" />
              <p className={classes.pTitle}>{title}</p>
            </Typography>
          </Link>
          <Typography variant="subtitle3" color="textPrimary">
            {restDetails.cuisine}
          </Typography>
          <Fragment>
            <Typography
              component="p"
              color="textSecondary"
              className={classes.addressStyle}
            >
              <Grade color="textSecondary" className={classes.addressGrade} />
              {address}
            </Typography>
          </Fragment>

        </CardContent>
        <CardMedia
          className={classes.cardMedia}
          image={image ? image[0] : 'default.jpg'}
          p={1}
        />
      </Card>
      <div className={classes.paperStyle}>
        <span className={`${classes.primary}`} style={{marginRight: '5px'}}>{restDetails.open_closed}</span>
        <span className={`${classes.primary}`} style={{marginRight: '5px'}}>
          *
        </span>
        <span className={` ${classes.primary}`} style={{marginRight: '5px'}}>{distance} miles away</span>
        <span style={{marginRight: '5px'}}><DirectionsWalk color="primary" />10min</span>
        <span style={{marginRight: '5px'}}><Grade color="primary" /> {restDetails.rating}</span>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ResturantCard);
