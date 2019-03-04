import React from 'react';
import fetch from 'isomorphic-unfetch';
import Select from 'react-select';

class stations extends React.Component {
  static async getInitialProps({ req }) {
    const res = await fetch(`https://brave-silk.glitch.me/nextbike-live.json`); //proxy server
    const json = await res.json();

    const cities = [];

    const stations = json.countries.reduce((stations, country) => {
      // reduce each country down into cities
      country.cities.forEach(city => {
        cities.push(city.name);

        city.places.forEach(place => {
          if (!place.bike) {
            stations.push({
              name: place.name,
              city: city.name,
              bikeCount: parseInt(place.bike_list.length)
            });
          }
        });
      });

      return stations;
    }, []);

    return { stations, cities };
  }

  state = {
    filterCity: undefined
  };

  render() {
    const options = this.props.cities.map(city => {
      return { value: city, label: city };
    });

    const sortedstations = this.props.stations
      .filter(station => {
        if (this.state.filterCity) {
          return station.city == this.state.filterCity;
        }
        return true;
      })
      .sort((a, b) => b.bikeCount - a.bikeCount);

    return (
      <div>
        <h1>All Nextbike Stations</h1>
        <h2>Sorted by number of parked bikes</h2>
        <Select
          options={options}
          onChange={value =>
            this.setState({ filterCity: value ? value.value : undefined })
          }
          isClearable={true}
        />
        <ul>
          {sortedstations.map(station => (
            <li key={station.name + Math.random()}>
              {station.name} in {station.city} has {station.bikeCount} bike{station.bikeCount ==
              1
                ? ''
                : 's'}!
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default stations;
