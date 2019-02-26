import React, { Component } from 'react';
import queryString from 'query-string';

import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';

import ResturantCard from './ResturantCard';
import SearchBox from './SearchBox';
import LocationButton from './LocationButton';
import MapWithAMarker from '../Map';

const API_KEY = process.env.REACT_APP_MAP_API_KEY;
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    zIndex: 600,
    width: '99%',
    top: '4px',
    paddingLeft: '10px',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  signupBtn: {
    borderRadius: 100,
    color: 'black',
    backgroundColor: 'white'
  },
  signinBtn: {
    borderRadius: 100,
    background: 'transparent',
    color: 'white',
  },
  mediumScreen: {
    position: 'relative',
    left: '20%',
  },
  largeScreen: {
    position: 'relative',
    left: '2%',
  },
  largerScreen: {
    position: 'relative',
    left: '25%',
  },
});

class SearchPage extends Component {
  state = {
    address: 'Chicago',
    areaToSearch: '',
    useMyLocation: false,
    userLocation: 'You are here',
    activeMarker: {},
  }

  componentDidMount() {
    const { location } = this.props;
    const { search } = location;
    const params = queryString.parse(search);
    const address = params.address;
    this.setState({
      ...this.state,
      address: address || 'Chicago',
    });
  }

  // triger a search when search icon is click
  // or when the enter key is pressed
  getLocation = (event) => {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    const { areaToSearch } = this.state;
    if (keycode === 13 || event.target.id === 'search-icon') {
      if (!areaToSearch) return;
      this.setState({
        ...this.state,
        address: areaToSearch,
        useMyLocation: false,
      });
    }
  }

  // get location to search
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      areaToSearch: event.target.value,
    });
  }

  // enable users use their location
  handleUseMyLocation = (event) => {
    event.preventDefault();
    let latLng;
    let state;
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        latLng = `${coords.latitude},${coords.longitude}`;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${API_KEY}`)
          .then((res) => res.json())
          .then((data) => {
            try {
              console.log(data, 'response');
              const compoundCode = data.plus_code.compound_code;
              state = compoundCode.split(' ')[1];
              const length = state.length - 1;
              state = state.substr(0, length);
              this.setState({
                ...this.state,
                areaToSearch: '',
                useMyLocation: true,
                lat: coords.latitude,
                lng: coords.longitude,
                address: state,
                userLocation: compoundCode
              });
            } catch(err) {
              console.log(err);
            }
          });
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      address,
      areaToSearch,
      useMyLocation,
      userLocation,
      lat,
      lng,
    } = this.state;

    // alter style for larger screens to
    // display signup and signin buttons
    let signinSignup = classes.mediumScreen;
    const large = window.matchMedia('(min-width: 1000px)');
    const larger = window.matchMedia('(min-width: 1200px)');
    if (large.matches && larger.matches) {
      signinSignup = classes.largerScreen;
    } else if (large.matches) {
      signinSignup = classes.largeScreen;
    }
    return (
      // Variables can be either lat and lon OR address
      <Query
        query={RESTAURANT_SEARCH_QUERY}
        variables={{
          address,
        }}
      >
        {({ loading, error, data = {} }) => {
          if (loading) {
            return <CircularProgress />;
          }

          // Make sure we have data
          if (
            data.search_restaurants
            && data.search_restaurants.results
            && data.search_restaurants.results.length > 0
          ) {
            return (
              <Grid
                container
                direction="row"
                justify="center"
                style={{height: '100vh' }}
              >
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={4}
                  lg={3}
                  xl={4}
                  style={{height: '100vh', overflow: 'scroll' }}
                >
                  {data.search_restaurants.results.map((r) => {
                    return <ResturantCard restDetails={r} />;
                  })}
                </Grid>
                <Grid
                  id="mapContainer"
                  xs="none"
                  sm={7}
                  md={8}
                  lg={9}
                  xl={8}
                >
                  <Grid container className={classes.root}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction="row"
                        spacing={16}
                        alignItems="center"
                        justify="flex-start"
                      >
                        <Grid key={1} item>
                          <LocationButton
                            handleUseMyLocation={this.handleUseMyLocation}
                            className={classes.paper}
                          />
                        </Grid>
                        <Grid key={2} item xs={3} lg={2} xl={2}>
                          <SearchBox
                            areaToSearch={areaToSearch}
                            handleChange={this.handleChange}
                            getLocation={this.getLocation}
                            className={classes.paper}
                          />
                        </Grid>
                        <Grid key={2} item className={signinSignup}>
                          <Button variant="contained" className={classes.signinBtn}>
                            Log In
                          </Button>
                        </Grid>
                        <Grid key={2} item className={signinSignup}>
                          <Button variant="contained" className={classes.signupBtn}>
                            Sign Up
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid>
                    <MapWithAMarker
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<div style={{ height: '100%' }} />}
                      containerElement={<div style={{ height: '100vh' }} />}
                      mapElement={<div style={{ height: '100%' }} />}
                      rests={data.search_restaurants.results}
                      useMyLocation={useMyLocation}
                      userLocation={userLocation}
                      lat={lat}
                      lng={lng}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          }

          // No Data Return
          return <div>No Results</div>;
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(SearchPage);
