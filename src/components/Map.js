import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import { compose, withStateHandlers } from 'recompose';


const MapWithAMarker = compose(
  withStateHandlers(() => ({
    isOpen: false,
    showInfo: '0',
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    }),
    showInfo: ({ showInfo, isOpen }) => (a) => ({
      isOpen: !isOpen,
      showInfoIndex: a,
    }),
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const {
    rests,
    lat,
    lng,
    useMyLocation,
    userLocation,
  } = props;
  let centerLat = rests[0].lat;
  let centerLng = rests[0].lon;
  let userMarker = '';
  if (useMyLocation) {
    centerLat = lat;
    centerLng = lng;
    userMarker = (
      <Marker
        position={{lat: centerLat, lng: centerLng}}
        name={userLocation}
        icon="https://maps.google.com/mapfiles/kml/pal4/icon52.png"
      />
    );
  } else {
    userMarker = undefined;
  }

  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: centerLat, lng: centerLng }}
      center={{ lat: centerLat, lng: centerLng}}
    >
      {
        rests.map((restDetail, index) => {
          return (
            <Marker
              key={restDetail.id}
              onClick={() => props.showInfo(index)}
              position={{lat: restDetail.lat, lng: restDetail.lon}}
              icon="https://maps.google.com/mapfiles/kml/pal2/icon32.png"
            >
              {
                props.isOpen && (props.showInfoIndex === index)
              && (
                <InfoWindow
                  onCloseClick={props.onToggleOpen}
                  position={{lat, lng}}
                >
                  <div style={{padding: '4px 6px', fontWeight: 'bold'}}><p>{restDetail.title}</p></div>
                </InfoWindow>
              )
              }
            </Marker>
          );
        })
      }
      {userMarker}
    </GoogleMap>
  );
});

export default MapWithAMarker;
