import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
/* global google */


const style = {
  height: "100%"
};

const containerStyle = {
  postion: "relative",
  right: 75,
  top: 150,
  height: "50%",
  width: "50%"
}

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state ={
      lat: this.props.lat,
      lng: this.props.lng,
      search: null,
      autocomplete: null,
      lng: -0.118092,
      lat: 51.509865,
    }
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this)
  }

  handlePlaceChanged() {
    const place = this.autocomplete.getPlace();
    this.setState({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
    this.props.setState({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
  }

  componentDidMount() {
    this.search = document.getElementById("search");
    this.autocomplete = new google.maps.places.Autocomplete(this.search, {
        fields: ["geometry", "formatted_address", "name"],
        componentRestrictions: {country: ['uk']}
    });
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged)
  }

  render() {
    return (
      <div>
      <Form.Control id="search" style={{marginBottom: "1em"}}type="text" placeholder="Location" required/>
      <Map
        google={this.props.google}
        style={style}
        containerStyle={containerStyle}
        zoom={14}
        center={
          {
            lat: this.state.lat,
            lng:  this.state.lng
          }
        }
        initialCenter={
          {
            lat: this.props.lat,
            lng:  this.props.lng,
          }
        }
        
      >
        <Marker title={'Location of incident'} name={'Incident'} position={{lng: this.state.lng, lat: this.state.lat}}/>
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAqXRStW5UDf3cnBQ5EWzd0czDCmlezFAg"
})(MapContainer)