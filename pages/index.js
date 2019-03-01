import React from 'react';
import fetch from 'isomorphic-unfetch';

import Bike from '../components/bike';

class index extends React.Component {
  static async getInitialProps({ req }) {
    const res = await fetch(`https://api.nextbike.net/maps/nextbike-live.json`); //TODO: implement some caching here
    const json = await res.json();

    // Put all bikes into an object
    // bike number -> station name -> city name
    const bikes = json.countries.reduce((bikes, country) => {
      // reduce each country down into cities
      country.cities.forEach(city => {
        city.places.forEach(place => {
          place.bike_numbers.forEach(bike => {
            // place.bike indicates free floating
            bikes[bike] = {
              lat: place.lat,
              long: place.lng,
              floating: place.bike,
              place: place.name,
              city: city.name,
              country: country.name
            };
          });
        });
      });

      return bikes;
    }, {});

    return { bikes };
  }

  state = {
    query: ''
  };

  handleKeyPress = event => {
    const potentialBikeId = event.target.value;

    this.setState({
      query: this.props.bikes.hasOwnProperty(potentialBikeId)
        ? potentialBikeId
        : null
    });
  };

  render() {
    const bikeCount = Object.keys(this.props.bikes).length.format();

    return (
      <div>
        <h1>Searching Nextbike's {bikeCount} bikes</h1>
        <form>
          <input placeholder="Bike id" onChange={this.handleKeyPress} />
        </form>

        <Bike id={this.state.query} {...this.props.bikes[this.state.query]} />
      </div>
    );
  }
}

export default index;

// Insert commas into number
// courtesy https://stackoverflow.com/questions/2254185/regular-expression-for-formatting-numbers-in-javascript
Number.prototype.format = function() {
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
