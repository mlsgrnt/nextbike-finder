import React from 'react';
import fetch from 'isomorphic-unfetch';

class stations extends React.Component {
  static async getInitialProps({ req }) {
    const res = await fetch(`https://brave-silk.glitch.me/nextbike-live.json`); //proxy server
    const json = await res.json();

    const stations = json.countries.reduce((stations, country) => {
      // reduce each country down into cities
      country.cities.forEach(city => {
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

    return { stations };
  }

  render() {
    const sortedstations = this.props.stations.sort(
      (a, b) => b.bikeCount - a.bikeCount
    );

    return (
      <div>
        <h1>All Nextbike Stations</h1>
        <h2>Sorted by number of parked bikes</h2>
        <ul>
          {sortedstations.map(station => (
            <li key={station.name}>
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
