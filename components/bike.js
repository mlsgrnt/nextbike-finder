import Map from './map';

const Bike = props => (
  <div>
    {props.id ? (
      <div>
        <h2>Bike {props.id}</h2>
        <h3>
          Last seen {props.floating ? 'floating' : `at ${props.place}`} in{' '}
          {props.city}
        </h3>
        <Map lat={props.lat} long={props.long} />
      </div>
    ) : (
      <h2>Bike not parked!</h2>
    )}
  </div>
);
export default Bike;
