import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
// import dotenv from 'dotenv-safe';

const API_KEY = process.env.REACT_APP_MAP_API_KEY;
export class MapContainer extends React.Component {
  state = {
    lat: 0,
    lng: 0,
    restTitle: '',
    infoWindowVisible: false,
    activeMarker: {}
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      infoWindowVisible: true,
      activeMarker: marker,
      restTitle: marker.name
    });
  }

  onMapClicked = (props) => {
    this.setState({
      infoWindowVisible: false,
      activeMarker: null
    });
  }

  componentWillMount = () => {
    // set map center to user current location
    const {rests } = this.props;
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        this.setState({
          lat: coords.latitude,
          lng: coords.longitude
        });
      });
    }

    // this will overide the definition above
    // using the lat and lon of one of the restaurants
    if (rests[0].lat && rests[0].lon) {
      this.setState({
        lat: rests[0].lat,
        lng: rests[0].lon,
      });
    }
  }

  render() {
    const { google, rests } = this.props;
    const { restTitle, infoWindowVisible, activeMarker, lat, lng } = this.state;
    const markers = rests.map((restDetail) => {
      return (
        <Marker
          key={restDetail.id}
          onClick={this.onMarkerClick}
          name={restDetail.title}
          position={{lat: restDetail.lat, lng: restDetail.lon}}
        />
      );
    });
    return (
      <Map
        google={google}
        zoom={14}
        initialCenter={{
          lat,
          lng,
        }}
        onClick={this.onMapClicked}
      >
        {markers}
        <InfoWindow
          onClose={this.onInfoWindowClose}
          visible={infoWindowVisible}
          marker={activeMarker}
        >
          <div>
            <h1>{restTitle}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (API_KEY)
})(MapContainer);
