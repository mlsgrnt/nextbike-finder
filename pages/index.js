import React from 'react';
import fetch from 'isomorphic-unfetch';

import Bike from '../components/bike';

class index extends React.Component {
  static async getInitialProps({ req }) {
    const res = await fetch(`https://brave-silk.glitch.me/nextbike-live.json`); //proxy server
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

  bikesLivingWithBike = bike => {
    if (!bike) return;

    return Object.keys(this.props.bikes).reduce((neighbors, b) => {
      if (bike.place == this.props.bikes[b].place) {
        neighbors.push(b);
      }

      return neighbors;
    }, []);
  };

  state = {
    query: ''
  };

  handleOnChange = event => {
    const potentialBikeId = event.target.value;

    this.setState({
      query: this.props.bikes.hasOwnProperty(potentialBikeId)
        ? potentialBikeId
        : null
    });
  };

  handleKeyPress = event => {
    // Prevent non-numeric input
    if (isNaN(String.fromCharCode(event.which || event.keyCode))) {
      event.preventDefault();
    }
  };

  render() {
    const bikeCount = Object.keys(this.props.bikes).length.format();

    return (
      <div>
        <h1>Searching {bikeCount} parked Nextbikes</h1>
        <form>
          <input
            placeholder="Bike number"
            onChange={this.handleOnChange}
            onKeyPress={this.handleKeyPress}
            maxLength="5"
          />
        </form>

        <Bike
          id={this.state.query}
          neighbors={this.bikesLivingWithBike(
            this.props.bikes[this.state.query]
          )}
          {...this.props.bikes[this.state.query]}
        />
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
