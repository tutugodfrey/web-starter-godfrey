import React, { Component } from 'react';
import queryString from 'query-string';

import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';

import ResturantCard from './ResturantCard';
import SearchBox from './SearchBox';
import LocationButton from './LocationButton';
import Map from '../Map';

const API_KEY = process.env.REACT_APP_MAP_API_KEY;
const styles = (theme) => ({
  root: {
    display: 'grid',
    flexGrow: 1,
    position: 'fixed',
    top: '5px',
    zIndex: 50,
    margin: '4px 10px',
    width: '100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    justify: 'center',
  },
});

class SearchPage extends Component {
  state = {
    address: 'Chicago',
    areaToSearch: '',
    useMyLocation: false,
    userLocation: 'You are here',
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

  formatText = (event, restDetails, field) => {
    if (field === 'address') {
      const content = event.target.innerHTML;
      if (content.length > 35 && content.indexOf('...') === -1) {
        event.target.innerHTML = `${restDetails.address.substr(0, 35)}...`;
      } else {
        event.target.innerHTML = restDetails.address;
      }
    }
    if (field === 'title') {
      const content = event.target.textContent;
      if (content.length > 20 && content.indexOf('...') === -1) {
        event.target.textContent = `${restDetails.address.substr(0, 20)}...`;
      } else {
        event.target.textContent = restDetails.address;
      }
    }
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
              <div>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  style={{height: '100vh' }}
                >
                  <Grid
                    column
                    item
                    xs={12}
                    sm={12}
                    md={5}
                    lg={4}
                    xl={4}
                    style={{height: '100vh', overflow: 'scroll' }}
                  >
                    {data.search_restaurants.results.map((r) => {
                      return (
                        <ResturantCard
                          restDetails={r}
                          formatText={this.formatText}
                        />
                      );
                    })}
                  </Grid>
                  <Grid
                    id="mapContainer"
                    column
                    xs="none"
                    sm="none"
                    md={7}
                    lg={8}
                    xl={4}
                  >
                    <div className={classes.root}>
                      <Grid container>
                        <Grid item xs={2}>
                          <LocationButton
                            handleUseMyLocation={this.handleUseMyLocation}
                            className={classes.paper}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <SearchBox
                            areaToSearch={areaToSearch}
                            handleChange={this.handleChange}
                            getLocation={this.getLocation}
                            className={classes.paper}
                          />
                        </Grid>
                      </Grid>
                    </div>
                    <Map
                      rests={data.search_restaurants.results}
                      lat={lat}
                      lng={lng}
                      useMyLocation={useMyLocation}
                      userLocation={userLocation}
                    />
                  </Grid>
                </Grid>
              </div>
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
