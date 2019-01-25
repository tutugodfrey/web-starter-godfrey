import React, { Component } from 'react';
import queryString from 'query-string';

import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';

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
                {data.search_restaurants.results.map((r) => {
                  return <div>{r.title} ({r.id})</div>;
                })}
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
