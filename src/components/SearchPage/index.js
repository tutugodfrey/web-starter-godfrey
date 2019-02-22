import React, { Component } from 'react';
import queryString from 'query-string';

import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';

import ResturantCard from './ResturantCard';
import SearchBox from './SearchBox';
import Map from '../Map';

const styles = {
  main: {
    position: 'fixed',
    top: '5px',
    zIndex: 50,
    margin: '4px 10px'
  }
};

class SearchPage extends Component {
  state = {
    address: 'Chicago',
    areaToSearch: '',
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

  showComplete = (event, restDetails, field) => {
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

  render() {
    const { classes } = this.props;
    const { address, areaToSearch } = this.state;
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
                          showComplete={this.showComplete}
                          showTruncated={this.showTruncated}
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
                    <div className={classes.main}>
                      <SearchBox
                        areaToSearch={areaToSearch}
                        handleChange={this.handleChange}
                        getLocation={this.getLocation}
                      />
                    </div>
                    <Map
                      rests={data.search_restaurants.results}
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
