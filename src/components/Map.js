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
    useMyLocation: false,
    activeMarker: {},
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
    const { rests, lat, lng, useMyLocation } = this.props;

    // this will overide the definition above
    // using the lat and lon of one of the restaurants
    if (rests[0].lat && rests[0].lon) {
      let latr = rests[0].lat;
      let lngr = rests[0].lon;

      if (useMyLocation) {
        latr = lat;
        lngr = lng;
      }

      this.setState({
        lat: latr,
        lng: lngr,
        useMyLocation,
      });
    }
  }

  componentWillUpdate = (nextProps) => {
    const {rests, lat, lng, useMyLocation } = nextProps;
    if (useMyLocation === true) {
      this.state.useMyLocation = true;
      this.state.lat = lat;
      this.state.lng = lng;
    }

    if (!useMyLocation) {
      const latr = rests[0].lat;
      const lngr = rests[0].lon;

      // reset the value from user location
      this.state.useMyLocation = false;
      this.state.lat = latr;
      this.state.lng = lngr;
    }
  }

  render() {
    const { google, rests, userLocation } = this.props;
    const {
      restTitle,
      infoWindowVisible,
      activeMarker,
      lat,
      lng,
      useMyLocation
    } = this.state;
    let userMarker;
    const markers = rests.map((restDetail) => {
      return (
        <Marker
          key={restDetail.id}
          onClick={this.onMarkerClick}
          name={restDetail.title}
          position={{lat: restDetail.lat, lng: restDetail.lon}}
          icon="https://maps.google.com/mapfiles/kml/pal2/icon32.png"
        />
      );
    });

    if (useMyLocation) {
      userMarker = (
        <Marker
          onClick={this.onMarkerClick}
          position={{lat, lng}}
          name={userLocation}
          map={google.Map}
          icon="https://maps.google.com/mapfiles/kml/pal4/icon52.png"
        />
      );
    } else {
      userMarker = undefined;
    }
    return (
      <Map
        google={google}
        zoom={14}
        initialCenter={{
          lat,
          lng,
        }}
        center={{
          lat,
          lng,
        }}
        onClick={this.onMapClicked}
      >
        {userMarker}
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
