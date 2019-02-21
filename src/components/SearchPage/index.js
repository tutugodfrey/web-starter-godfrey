import React, { Component } from 'react';
import queryString from 'query-string';

import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';

import ResturantCard from './ResturantCard';
import Map from '../Map';

class SearchPage extends Component {
  state = {
    address: 'Chicago',
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

  render() {
    return (
      // Variables can be either lat and lon OR address
      <Query
        query={RESTAURANT_SEARCH_QUERY}
        variables={{
          address: this.state,
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

export default SearchPage;
